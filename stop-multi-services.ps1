# Script PowerShell pour arrêter les services Docker multi-conteneurs
# Usage: .\stop-multi-services.ps1 [options]
# Options:
#   -Clean : Supprime également les volumes
#   -Images : Supprime également les images

param(
    [switch]$Clean,
    [switch]$Images
)

Write-Host "🛑 Arrêt des services Work&You (Architecture Multi-Conteneurs)" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est en cours d'exécution
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker n'est pas en cours d'exécution." -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Arrêt des conteneurs..." -ForegroundColor Yellow

if ($Images) {
    Write-Host "   → Suppression des images..." -ForegroundColor Yellow
    docker-compose -f docker-compose.multi.yml down --rmi all
} elseif ($Clean) {
    Write-Host "   → Suppression des volumes..." -ForegroundColor Yellow
    docker-compose -f docker-compose.multi.yml down -v
} else {
    docker-compose -f docker-compose.multi.yml down
}

Write-Host ""
Write-Host "✅ Services arrêtés avec succès!" -ForegroundColor Green
Write-Host ""

if (-not $Clean -and -not $Images) {
    Write-Host "💡 Astuce: Utilisez les options suivantes pour un nettoyage complet:" -ForegroundColor Cyan
    Write-Host "   -Clean   : Supprimer également les volumes" -ForegroundColor White
    Write-Host "   -Images  : Supprimer également les images" -ForegroundColor White
    Write-Host ""
    Write-Host "   Exemple: .\stop-multi-services.ps1 -Clean" -ForegroundColor Yellow
}

