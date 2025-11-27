# Script PowerShell pour lancer le projet dans Docker WSL 2
# Exécutez ce script depuis PowerShell Windows

Write-Host "🐳 Démarrage du projet Outils Work&You dans Docker WSL 2" -ForegroundColor Cyan
Write-Host ""

# Obtenir le chemin du projet
$projectPath = Get-Location
$wslPath = $projectPath.Path -replace '^([A-Z]):', '/mnt/$1' -replace '\\', '/' -replace '^/mnt/', '/mnt/' -replace '^(.)', { $_.Value.ToLower() }

Write-Host "📁 Chemin du projet: $projectPath" -ForegroundColor Gray
Write-Host "🐧 Chemin WSL: $wslPath" -ForegroundColor Gray
Write-Host ""

# Vérifier si WSL est installé
try {
    wsl --version | Out-Null
} catch {
    Write-Host "❌ WSL n'est pas installé sur votre système" -ForegroundColor Red
    Write-Host "Installez WSL 2 avec: wsl --install" -ForegroundColor Yellow
    exit 1
}

# Menu de sélection
Write-Host "Choisissez le mode d'exécution:" -ForegroundColor Yellow
Write-Host "1) Production (port 80)" -ForegroundColor White
Write-Host "2) Développement avec hot-reload (ports 5173 et 5174)" -ForegroundColor White
Write-Host "3) Arrêter tous les conteneurs" -ForegroundColor White
Write-Host "4) Voir les logs" -ForegroundColor White
Write-Host "5) Reconstruire l'image" -ForegroundColor White
$choice = Read-Host "Votre choix (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Lancement en mode PRODUCTION..." -ForegroundColor Green
        Write-Host ""
        wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose up -d"
        Write-Host ""
        Write-Host "✅ Application lancée en mode production sur http://localhost" -ForegroundColor Green
        Write-Host "📊 Pour voir les logs: .\start-docker.ps1 et choisir l'option 4" -ForegroundColor Cyan
        Write-Host "🛑 Pour arrêter: .\start-docker.ps1 et choisir l'option 3" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "🔧 Lancement en mode DÉVELOPPEMENT..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Note: Utilisez Ctrl+C pour arrêter" -ForegroundColor Yellow
        Write-Host ""
        wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose -f docker-compose.dev.yml up"
    }
    "3" {
        Write-Host ""
        Write-Host "🛑 Arrêt de tous les conteneurs..." -ForegroundColor Yellow
        wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose down && docker-compose -f docker-compose.dev.yml down"
        Write-Host "✅ Conteneurs arrêtés" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "📊 Affichage des logs (Ctrl+C pour quitter)..." -ForegroundColor Cyan
        Write-Host ""
        wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose logs -f"
    }
    "5" {
        Write-Host ""
        Write-Host "🔨 Reconstruction de l'image..." -ForegroundColor Yellow
        wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose down && docker-compose build --no-cache"
        Write-Host "✅ Image reconstruite" -ForegroundColor Green
        Write-Host ""
        Write-Host "Voulez-vous la lancer maintenant? (o/n)" -ForegroundColor Yellow
        $launch = Read-Host
        if ($launch -eq "o" -or $launch -eq "O") {
            wsl -d Ubuntu bash -c "cd '$wslPath' && docker-compose up -d"
            Write-Host "✅ Application lancée" -ForegroundColor Green
        }
    }
    default {
        Write-Host "❌ Choix invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ Terminé!" -ForegroundColor Cyan

