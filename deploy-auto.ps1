# Script PowerShell de deploiement automatise sur Hostinger
# Permet a l'IA de deployer en autonomie

param(
    [switch]$SkipBuild,
    [switch]$OnlyN8n,
    [switch]$Verbose
)

Write-Host "Deploiement automatise sur Hostinger" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Charger la configuration SSH
if (-not (Test-Path ".ssh-config")) {
    Write-Host "Fichier .ssh-config non trouve" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creez le fichier .ssh-config avec les informations du serveur:" -ForegroundColor Yellow
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
    Write-Host "Configuration SSH incomplete dans .ssh-config" -ForegroundColor Red
    exit 1
}

Write-Host "Serveur: $SSH_USER@$SSH_HOST" -ForegroundColor Cyan
Write-Host "Repertoire: $REMOTE_APP_DIR" -ForegroundColor Cyan
Write-Host "Branche: $GIT_BRANCH" -ForegroundColor Cyan
Write-Host ""

# 1. Commit et push local
if (-not $SkipBuild) {
    Write-Host "Verification des modifications locales..." -ForegroundColor Yellow
    
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "Modifications detectees, commit en cours..." -ForegroundColor Yellow
        git add .
        $commitMsg = "deploy: mise a jour automatique $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        git commit -m $commitMsg
        Write-Host "Commit cree: $commitMsg" -ForegroundColor Green
    } else {
        Write-Host "Aucune modification locale" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Push vers GitHub..." -ForegroundColor Yellow
    git push outils deploy-clean:production
    Write-Host "Code pousse sur GitHub" -ForegroundColor Green
    Write-Host ""
}

# 2. Connexion SSH et deploiement
Write-Host "Connexion au serveur..." -ForegroundColor Yellow

$commands = @(
    "cd $REMOTE_APP_DIR",
    "echo 'Pull du code...'",
    "git pull origin $GIT_BRANCH",
    "echo 'Verification de Docker...'",
    "docker --version",
    "echo 'Arret des conteneurs existants...'",
    "docker-compose -f docker-compose.multi.yml down",
    "echo 'Build et demarrage des services...'",
    "docker-compose -f docker-compose.multi.yml up -d --build",
    "echo 'Attente du demarrage (20s)...'",
    "sleep 20",
    "echo 'Verification des services...'",
    "docker ps",
    "echo ''",
    "echo 'Tests de connectivite...'",
    "curl -sf http://localhost/health && echo 'Nginx OK' || echo 'Nginx ERREUR'",
    "curl -sf http://localhost/n8n/ && echo 'n8n OK' || echo 'n8n ERREUR'",
    "curl -sf http://localhost/carte && echo 'Carte OK' || echo 'Carte ERREUR'",
    "curl -sf http://localhost/flux && echo 'Flux OK' || echo 'Flux ERREUR'",
    "curl -sf http://localhost/signatures && echo 'Signatures OK' || echo 'Signatures ERREUR'",
    "curl -sf http://localhost/methode && echo 'Methode OK' || echo 'Methode ERREUR'",
    "echo ''",
    "echo 'Logs n8n (dernieres 10 lignes):'",
    "docker logs workandyou-n8n --tail 10"
)

$sshCmd = $commands -join ' && '

if ($Verbose) {
    Write-Host "Commande SSH:" -ForegroundColor Gray
    Write-Host $sshCmd -ForegroundColor DarkGray
    Write-Host ""
}

# Executer via SSH
ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" $sshCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "DEPLOIEMENT REUSSI!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Application accessible sur:" -ForegroundColor Cyan
    Write-Host "   https://outils.workandyou.fr" -ForegroundColor White
    Write-Host ""
    Write-Host "Services disponibles:" -ForegroundColor Cyan
    Write-Host "   n8n:        https://outils.workandyou.fr/n8n" -ForegroundColor White
    Write-Host "   Carte:      https://outils.workandyou.fr/carte" -ForegroundColor White
    Write-Host "   Flux:       https://outils.workandyou.fr/flux" -ForegroundColor White
    Write-Host "   Signatures: https://outils.workandyou.fr/signatures" -ForegroundColor White
    Write-Host "   Methode:    https://outils.workandyou.fr/methode" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERREUR LORS DU DEPLOIEMENT" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour voir les logs sur le serveur:" -ForegroundColor Yellow
    Write-Host "   ssh $SSH_USER@$SSH_HOST" -ForegroundColor White
    Write-Host "   cd $REMOTE_APP_DIR" -ForegroundColor White
    Write-Host "   docker logs workandyou-n8n" -ForegroundColor White
    Write-Host ""
    exit 1
}
