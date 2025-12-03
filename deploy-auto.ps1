# Script PowerShell de déploiement automatisé sur Hostinger
# Permet à l'IA de déployer en autonomie

param(
    [switch]$SkipBuild,
    [switch]$OnlyN8n,
    [switch]$Verbose
)

Write-Host "🚀 Déploiement automatisé sur Hostinger" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Charger la configuration SSH
if (-not (Test-Path ".ssh-config")) {
    Write-Host "❌ Fichier .ssh-config non trouvé" -ForegroundColor Red
    Write-Host ""
    Write-Host "Créez le fichier .ssh-config avec les informations du serveur:" -ForegroundColor Yellow
    Write-Host "   cp .ssh-config.example .ssh-config" -ForegroundColor White
    Write-Host "   nano .ssh-config" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Lire la configuration
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

if (-not $SSH_HOST -or -not $SSH_USER) {
    Write-Host "❌ Configuration SSH incomplète dans .ssh-config" -ForegroundColor Red
    exit 1
}

Write-Host "📡 Serveur: $SSH_USER@$SSH_HOST" -ForegroundColor Cyan
Write-Host "📂 Répertoire: $REMOTE_APP_DIR" -ForegroundColor Cyan
Write-Host "🌿 Branche: $GIT_BRANCH" -ForegroundColor Cyan
Write-Host ""

# 1. Commit et push local
if (-not $SkipBuild) {
    Write-Host "📦 Vérification des modifications locales..." -ForegroundColor Yellow
    
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "📝 Modifications détectées, commit en cours..." -ForegroundColor Yellow
        git add .
        $commitMsg = "deploy: mise à jour automatique $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        git commit -m $commitMsg
        Write-Host "✅ Commit créé: $commitMsg" -ForegroundColor Green
    } else {
        Write-Host "✅ Aucune modification locale" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
    git push outils deploy-clean:production
    Write-Host "✅ Code poussé sur GitHub" -ForegroundColor Green
    Write-Host ""
}

# 2. Connexion SSH et déploiement
Write-Host "🔌 Connexion au serveur..." -ForegroundColor Yellow

$sshCmd = @"
cd $REMOTE_APP_DIR && \
echo '📥 Pull du code...' && \
git pull origin $GIT_BRANCH && \
echo '🐳 Vérification de Docker...' && \
docker --version && \
echo '🛑 Arrêt des conteneurs existants...' && \
docker-compose -f docker-compose.multi.yml down && \
echo '🔨 Build et démarrage des services...' && \
docker-compose -f docker-compose.multi.yml up -d --build && \
echo '⏳ Attente du démarrage (20s)...' && \
sleep 20 && \
echo '🔍 Vérification des services...' && \
docker ps && \
echo '' && \
echo '🧪 Tests de connectivité...' && \
curl -sf http://localhost/health && echo '✅ Nginx OK' || echo '❌ Nginx ERREUR' && \
curl -sf http://localhost/n8n/ && echo '✅ n8n OK' || echo '❌ n8n ERREUR' && \
curl -sf http://localhost/carte && echo '✅ Carte OK' || echo '❌ Carte ERREUR' && \
curl -sf http://localhost/flux && echo '✅ Flux OK' || echo '❌ Flux ERREUR' && \
curl -sf http://localhost/signatures && echo '✅ Signatures OK' || echo '❌ Signatures ERREUR' && \
curl -sf http://localhost/methode && echo '✅ Méthode OK' || echo '❌ Méthode ERREUR' && \
echo '' && \
echo '📋 Logs n8n (dernières 10 lignes):' && \
docker logs workandyou-n8n --tail 10
"@

if ($Verbose) {
    Write-Host "Commande SSH:" -ForegroundColor Gray
    Write-Host $sshCmd -ForegroundColor DarkGray
    Write-Host ""
}

# Exécuter via SSH
ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" $sshCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Application accessible sur:" -ForegroundColor Cyan
    Write-Host "   https://outils.workandyou.fr" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 Services disponibles:" -ForegroundColor Cyan
    Write-Host "   • n8n:        https://outils.workandyou.fr/n8n" -ForegroundColor White
    Write-Host "   • Carte:      https://outils.workandyou.fr/carte" -ForegroundColor White
    Write-Host "   • Flux:       https://outils.workandyou.fr/flux" -ForegroundColor White
    Write-Host "   • Signatures: https://outils.workandyou.fr/signatures" -ForegroundColor White
    Write-Host "   • Méthode:    https://outils.workandyou.fr/methode" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERREUR LORS DU DÉPLOIEMENT" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour voir les logs sur le serveur:" -ForegroundColor Yellow
    Write-Host "   ssh $SSH_USER@$SSH_HOST" -ForegroundColor White
    Write-Host "   cd $REMOTE_APP_DIR" -ForegroundColor White
    Write-Host "   docker logs workandyou-n8n" -ForegroundColor White
    Write-Host ""
    exit 1
}

