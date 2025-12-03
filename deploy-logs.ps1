# Script pour voir les logs en temps réel depuis le serveur

param(
    [string]$Service = "all",
    [int]$Lines = 50
)

Write-Host "📋 Logs du serveur Hostinger" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Charger la configuration SSH
if (-not (Test-Path ".ssh-config")) {
    Write-Host "❌ Fichier .ssh-config non trouvé" -ForegroundColor Red
    exit 1
}

$config = @{}
Get-Content ".ssh-config" | Where-Object { $_ -notmatch '^#' -and $_ -match '=' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    $config[$key.Trim()] = $value.Trim()
}

$SSH_HOST = $config['SSH_HOST']
$SSH_USER = $config['SSH_USER']
$SSH_PORT = $config['SSH_PORT']
$REMOTE_APP_DIR = $config['REMOTE_APP_DIR']

Write-Host "📡 Serveur: $SSH_USER@$SSH_HOST" -ForegroundColor Cyan
Write-Host "📦 Service: $Service" -ForegroundColor Cyan
Write-Host ""

# Construire la commande selon le service
$dockerCmd = if ($Service -eq "all") {
    "docker-compose -f docker-compose.multi.yml logs --tail=$Lines -f"
} else {
    "docker logs workandyou-$Service --tail=$Lines -f"
}

$sshCmd = "cd $REMOTE_APP_DIR && $dockerCmd"

Write-Host "Appuyez sur Ctrl+C pour arrêter..." -ForegroundColor Yellow
Write-Host ""

ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" $sshCmd

