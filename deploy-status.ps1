# Script pour vérifier l'état du déploiement sur le serveur

Write-Host "📊 État du déploiement Hostinger" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Charger la configuration SSH
if (-not (Test-Path ".ssh-config")) {
    Write-Host "❌ Fichier .ssh-config non trouvé" -ForegroundColor Red
    Write-Host "   Créez-le avec: cp .ssh-config.example .ssh-config" -ForegroundColor Yellow
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
Write-Host ""

# Commande SSH pour vérifier l'état
$sshCmd = @"
cd $REMOTE_APP_DIR && \
echo '🐳 Conteneurs Docker:' && \
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' && \
echo '' && \
echo '📊 Utilisation ressources:' && \
docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}' && \
echo '' && \
echo '🧪 Tests de connectivité:' && \
curl -sf http://localhost/health && echo '✅ Nginx OK' || echo '❌ Nginx ERREUR' && \
curl -sf http://localhost/n8n/ && echo '✅ n8n OK' || echo '❌ n8n ERREUR' && \
curl -sf http://localhost/carte && echo '✅ Carte OK' || echo '❌ Carte ERREUR' && \
curl -sf http://localhost/flux && echo '✅ Flux OK' || echo '❌ Flux ERREUR' && \
curl -sf http://localhost/signatures && echo '✅ Signatures OK' || echo '❌ Signatures ERREUR' && \
curl -sf http://localhost/methode && echo '✅ Méthode OK' || echo '❌ Méthode ERREUR' && \
echo '' && \
echo '📋 Derniers logs (5 lignes par service):' && \
echo '--- n8n ---' && \
docker logs workandyou-n8n --tail 5 2>&1 && \
echo '--- Nginx ---' && \
docker logs workandyou-nginx --tail 5 2>&1
"@

ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" $sshCmd

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

