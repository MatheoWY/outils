# Script de deploiement en arriere-plan sur le serveur
# Le build se fait sur le serveur, vous pouvez fermer le terminal local

Write-Host "Lancement du deploiement en arriere-plan..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Charger la configuration SSH
if (-not (Test-Path ".ssh-config")) {
    Write-Host "Fichier .ssh-config non trouve" -ForegroundColor Red
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
$GIT_BRANCH = $config['GIT_BRANCH']

Write-Host "Serveur: $SSH_USER@$SSH_HOST" -ForegroundColor Cyan
Write-Host ""

# Creer un script de deploiement sur le serveur
$deployScript = @"
#!/bin/bash
cd $REMOTE_APP_DIR
echo '=== Deploiement demarre ===' > deploy.log
date >> deploy.log

echo 'Pull du code...' | tee -a deploy.log
git pull origin $GIT_BRANCH >> deploy.log 2>&1

echo 'Arret des conteneurs...' | tee -a deploy.log
docker-compose -f docker-compose.multi.yml down >> deploy.log 2>&1

echo 'Build et demarrage (cela peut prendre 5-10 minutes)...' | tee -a deploy.log
docker-compose -f docker-compose.multi.yml up -d --build >> deploy.log 2>&1

echo 'Attente du demarrage...' | tee -a deploy.log
sleep 30

echo 'Verification des services...' | tee -a deploy.log
docker ps >> deploy.log 2>&1

echo 'Tests de connectivite...' | tee -a deploy.log
curl -sf http://localhost/health && echo 'Nginx OK' || echo 'Nginx ERREUR' | tee -a deploy.log
curl -sf http://localhost/n8n/ && echo 'n8n OK' || echo 'n8n ERREUR' | tee -a deploy.log
curl -sf http://localhost/carte && echo 'Carte OK' || echo 'Carte ERREUR' | tee -a deploy.log
curl -sf http://localhost/flux && echo 'Flux OK' || echo 'Flux ERREUR' | tee -a deploy.log
curl -sf http://localhost/signatures && echo 'Signatures OK' || echo 'Signatures ERREUR' | tee -a deploy.log
curl -sf http://localhost/methode && echo 'Methode OK' || echo 'Methode ERREUR' | tee -a deploy.log

echo '=== Deploiement termine ===' | tee -a deploy.log
date >> deploy.log
"@

# Envoyer et executer le script en arriere-plan
Write-Host "Envoi du script de deploiement sur le serveur..." -ForegroundColor Yellow
ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" "cat > ~/deploy-now.sh << 'EOF'
$deployScript
EOF
chmod +x ~/deploy-now.sh"

Write-Host "Lancement du deploiement en arriere-plan..." -ForegroundColor Yellow
ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" "nohup ~/deploy-now.sh > /dev/null 2>&1 &"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Deploiement lance en arriere-plan!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Le build se fait sur le serveur (5-10 minutes)." -ForegroundColor Cyan
Write-Host "Vous pouvez fermer ce terminal." -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour suivre la progression:" -ForegroundColor Yellow
Write-Host "   .\deploy-logs.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir le statut:" -ForegroundColor Yellow
Write-Host "   .\deploy-status.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir le log de deploiement:" -ForegroundColor Yellow
Write-Host "   ssh $SSH_USER@$SSH_HOST 'tail -f ~/outils-workandyou/deploy.log'" -ForegroundColor White
Write-Host ""

