# 🚀 Démarrage Rapide - Docker WSL 2

## Étapes d'installation (à faire une seule fois)

### 1. Ouvrir Ubuntu dans WSL 2

```powershell
# Depuis PowerShell Windows
wsl -d Ubuntu
```

### 2. Naviguer vers votre projet

```bash
cd "/mnt/c/Users/mathe/OneDrive/Desktop/Lovable carte france"
```

### 3. Installer Docker (si pas encore fait)

```bash
# Installation
sudo apt update
sudo apt install -y docker.io docker-compose

# Configuration utilisateur
sudo usermod -aG docker $USER

# Démarrer Docker
sudo service docker start

# Fermer et rouvrir le terminal WSL
exit
```

### 4. Créer le fichier .env

```bash
# Créer le fichier .env manuellement
cat > .env << 'EOF'
# Configuration GitHub (pour l'upload de signatures)
GITHUB_PAT=your_github_personal_access_token
REPO_OWNER=MatheoWY
REPO_NAME=signatures
BRANCH=main

# Configuration API Work&You (optionnel)
WORKANDYOU_API_URL=

# Configuration Google OAuth (optionnel - auth désactivée par défaut)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=changez_moi_avec_une_chaine_aleatoire
ALLOWED_DOMAIN=workandyou.fr
GOOGLE_CALLBACK_URL=http://localhost:80/auth/google/callback

# Environnement
NODE_ENV=production
PORT=80
EOF

# Éditer avec vos vraies valeurs
nano .env
```

## 🎯 Lancer l'application

### Méthode 1 : Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x start-docker-wsl.sh

# Lancer
./start-docker-wsl.sh
```

### Méthode 2 : Commandes directes

#### Mode Production

```bash
docker-compose up -d
```

Accès : http://localhost

#### Mode Développement

```bash
docker-compose -f docker-compose.dev.yml up
```

Accès : 
- Frontend : http://localhost:5173
- API : http://localhost:5174

## 🛑 Arrêter l'application

```bash
# Mode production
docker-compose down

# Mode développement
docker-compose -f docker-compose.dev.yml down
```

## 📊 Voir les logs

```bash
docker-compose logs -f
```

## 🔄 Redémarrer après un changement

```bash
# Reconstruire et relancer
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## ⚡ Astuces

### Démarrer Docker automatiquement

Ajoutez ceci à votre `~/.bashrc` :

```bash
echo 'sudo service docker start > /dev/null 2>&1' >> ~/.bashrc
```

### Alias utiles

```bash
# Ajoutez ces alias dans ~/.bashrc
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose down && docker-compose build --no-cache && docker-compose up -d'
```

Puis rechargez :

```bash
source ~/.bashrc
```

Maintenant vous pouvez utiliser :
- `dcu` : lancer
- `dcd` : arrêter
- `dcl` : voir les logs
- `dcr` : reconstruire et relancer

## 🎉 C'est tout !

Votre application tourne maintenant entièrement dans Docker via WSL 2, sans Docker Desktop !

