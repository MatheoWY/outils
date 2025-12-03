# Script PowerShell pour afficher les logs des services Docker
# Usage: .\logs-multi-services.ps1 [service_name]
# Sans argument: affiche les logs de tous les services
# Avec argument: affiche uniquement les logs du service spécifié

param(
    [string]$Service = "all",
    [int]$Lines = 100
)

Write-Host "📋 Logs des services Work&You" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est en cours d'exécution
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker n'est pas en cours d'exécution." -ForegroundColor Red
    exit 1
}

if ($Service -eq "all") {
    Write-Host "📊 Affichage des logs de tous les services (dernières $Lines lignes)..." -ForegroundColor Yellow
    Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    Write-Host ""
    docker-compose -f docker-compose.multi.yml logs -f --tail=$Lines
} else {
    $validServices = @("nginx", "carte", "flux", "signatures", "methode", "n8n")
    if ($validServices -contains $Service) {
        Write-Host "📊 Affichage des logs du service: $Service (dernières $Lines lignes)..." -ForegroundColor Yellow
        Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
        Write-Host ""
        docker-compose -f docker-compose.multi.yml logs -f --tail=$Lines $Service
    } else {
        Write-Host "❌ Service invalide: $Service" -ForegroundColor Red
        Write-Host "   Services disponibles: nginx, carte, flux, signatures, methode, n8n, all" -ForegroundColor Yellow
        exit 1
    }
}

