# Script PowerShell pour démarrer l'architecture multi-services avec Docker Compose
# Démarre 5 services: Carte, Flux, Signatures, Méthode, n8n

Write-Host "=== Démarrage de l'architecture multi-services Work&You ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est en cours d'exécution
Write-Host "Vérification de Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker n'est pas en cours d'exécution." -ForegroundColor Red
    Write-Host "Veuillez démarrer Docker Desktop et réessayer." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker est actif" -ForegroundColor Green
Write-Host ""

# Vérifier si le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env non trouvé. Copie depuis env.example..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✓ Fichier .env créé. Pensez à le configurer!" -ForegroundColor Green
    Write-Host ""
}

# Arrêter les conteneurs existants
Write-Host "Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose -f docker-compose.multi.yml down 2>$null
Write-Host ""

# Construire et démarrer les services
Write-Host "Construction et démarrage des services..." -ForegroundColor Yellow
Write-Host "Cela peut prendre plusieurs minutes lors de la première exécution..." -ForegroundColor Gray
Write-Host ""

docker-compose -f docker-compose.multi.yml up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== ✓ Services démarrés avec succès ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Services disponibles:" -ForegroundColor Cyan
    Write-Host "  • Page d'accueil:        http://localhost" -ForegroundColor White
    Write-Host "  • Carte Work&You:        http://localhost/carte" -ForegroundColor White
    Write-Host "  • Check Flux:            http://localhost/flux" -ForegroundColor White
    Write-Host "  • Signatures:            http://localhost/signatures" -ForegroundColor White
    Write-Host "  • Méthode Work&You:      http://localhost/methode" -ForegroundColor White
    Write-Host "  • n8n Automation:        http://localhost/n8n" -ForegroundColor White
    Write-Host ""
    Write-Host "Commandes utiles:" -ForegroundColor Cyan
    Write-Host "  • Voir les logs:         .\logs-multi-services.ps1" -ForegroundColor Gray
    Write-Host "  • Arrêter les services:  .\stop-multi-services.ps1" -ForegroundColor Gray
    Write-Host "  • Tester les services:   .\test-multi-services.ps1" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du démarrage des services" -ForegroundColor Red
    Write-Host "Consultez les logs avec: docker-compose -f docker-compose.multi.yml logs" -ForegroundColor Yellow
    exit 1
}
