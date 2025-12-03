# Script de test pour vérifier que tous les services fonctionnent correctement
# Usage: .\test-multi-services.ps1

Write-Host "🧪 Tests des Services Work&You" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Fonction pour tester une URL
function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedStatus = "200"
    )
    
    Write-Host "🔍 Test de $Name..." -ForegroundColor Yellow -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host " ✅ OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ❌ ERREUR (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host " ❌ ERREUR ($($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Fonction pour tester un conteneur
function Test-Container {
    param(
        [string]$Name,
        [string]$ContainerName
    )
    
    Write-Host "🐳 Test du conteneur $Name..." -ForegroundColor Yellow -NoNewline
    
    $container = docker ps --filter "name=$ContainerName" --format "{{.Status}}"
    
    if ($container -match "Up") {
        Write-Host " ✅ OK (Running)" -ForegroundColor Green
        return $true
    } else {
        Write-Host " ❌ ERREUR (Not running)" -ForegroundColor Red
        return $false
    }
}

Write-Host "📋 Phase 1: Vérification des conteneurs Docker" -ForegroundColor Cyan
Write-Host "───────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

$containers = @(
    @{Name="Nginx"; Container="workandyou-nginx"},
    @{Name="Carte"; Container="workandyou-carte"},
    @{Name="Flux"; Container="workandyou-flux"},
    @{Name="Signatures"; Container="workandyou-signatures"},
    @{Name="Méthode"; Container="workandyou-methode"},
    @{Name="n8n"; Container="workandyou-n8n"}
)

foreach ($container in $containers) {
    if (-not (Test-Container -Name $container.Name -ContainerName $container.Container)) {
        $allPassed = $false
    }
}

Write-Host ""
Write-Host "📋 Phase 2: Tests HTTP des services" -ForegroundColor Cyan
Write-Host "────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Attendre un peu que les services soient prêts
Write-Host "⏳ Attente du démarrage complet des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host ""

$services = @(
    @{Name="Nginx Health"; Url="http://localhost/health"},
    @{Name="Page d'accueil"; Url="http://localhost/"},
    @{Name="Carte Work&You"; Url="http://localhost/carte"},
    @{Name="Check Flux"; Url="http://localhost/flux"},
    @{Name="Signatures"; Url="http://localhost/signatures"},
    @{Name="Méthode Work&You"; Url="http://localhost/methode"},
    @{Name="n8n Automation"; Url="http://localhost/n8n/"},
    @{Name="API Signatures"; Url="http://localhost/api/health"}
)

foreach ($service in $services) {
    if (-not (Test-Service -Name $service.Name -Url $service.Url)) {
        $allPassed = $false
    }
}

Write-Host ""
Write-Host "📋 Phase 3: Vérification des logs" -ForegroundColor Cyan
Write-Host "──────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Vérifier les erreurs dans les logs
Write-Host "📄 Vérification des erreurs critiques dans les logs..." -ForegroundColor Yellow

$logCheck = docker-compose -f docker-compose.multi.yml logs --tail=50 2>&1 | Select-String -Pattern "error|fatal|panic" -CaseSensitive:$false

if ($logCheck) {
    Write-Host "⚠️  Des erreurs ont été détectées dans les logs:" -ForegroundColor Yellow
    $logCheck | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "✅ Aucune erreur critique détectée" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan

# Résultat final
Write-Host ""
if ($allPassed) {
    Write-Host "✅ TOUS LES TESTS SONT PASSÉS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 L'application est opérationnelle!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 URLs d'accès:" -ForegroundColor Cyan
    Write-Host "   🏠 Page d'accueil:     http://localhost/" -ForegroundColor White
    Write-Host "   🗺️  Carte Work&You:    http://localhost/carte" -ForegroundColor White
    Write-Host "   📊 Check Flux:         http://localhost/flux" -ForegroundColor White
    Write-Host "   ✍️  Signatures:         http://localhost/signatures" -ForegroundColor White
    Write-Host "   🧠 Méthode Work&You:   http://localhost/methode" -ForegroundColor White
    Write-Host "   ⚙️  n8n Automation:     http://localhost/n8n" -ForegroundColor White
    exit 0
} else {
    Write-Host "❌ CERTAINS TESTS ONT ÉCHOUÉ" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Actions suggérées:" -ForegroundColor Yellow
    Write-Host "   1. Vérifier les logs: .\logs-multi-services.ps1" -ForegroundColor White
    Write-Host "   2. Redémarrer les services: .\start-multi-services.ps1" -ForegroundColor White
    Write-Host "   3. Rebuild les services: docker-compose -f docker-compose.multi.yml up -d --build" -ForegroundColor White
    Write-Host ""
    exit 1
}

