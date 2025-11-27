# Guide de déploiement Hostinger KVM2

## 📋 Prérequis

- Serveur VPS Hostinger configuré (Ubuntu 22.04/24.04)
- Accès SSH au serveur
- Nom de domaine configuré pointant vers l'IP du serveur

## 🔧 Configuration du serveur

### 1. Connexion SSH

```bash
ssh root@votre-ip-serveur
```

### 2. Installation des dépendances

```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installation Python 3.11+
apt install -y python3 python3-pip python3-venv

# Installation Nginx
apt install -y nginx

# Installation PM2 (gestionnaire de processus Node.js)
npm install -g pm2

# Installation des outils système
apt install -y git curl build-essential
```

### 3. Création de l'utilisateur application

```bash
# Créer un utilisateur non-root pour l'application
useradd -m -s /bin/bash appuser
usermod -aG sudo appuser

# Se connecter avec cet utilisateur
su - appuser
```

### 4. Clonage du projet

```bash
cd ~
git clone <URL_DU_REPO> app
cd app
```

### 5. Configuration des variables d'environnement

```bash
# Copier le template
cp env.example .env

# Éditer le fichier .env
nano .env
```

**Variables OBLIGATOIRES en production :**

```bash
# ====================================================
# CONFIGURATION PRODUCTION
# ====================================================
NODE_ENV=production
PORT=3000

# ====================================================
# OAUTH GOOGLE (OBLIGATOIRE)
# ====================================================
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-secret
SESSION_SECRET=votre-secret-genere-avec-openssl
ALLOWED_DOMAIN=workandyou.fr
GOOGLE_CALLBACK_URL=https://votre-domaine.com/auth/google/callback

# ====================================================
# GITHUB (pour upload signatures)
# ====================================================
GITHUB_PAT=ghp_votre_token
REPO_OWNER=MatheoWY
REPO_NAME=signatures
BRANCH=main

# ====================================================
# API PYTHON WORK&YOU (locale)
# ====================================================
WORKANDYOU_API_URL=http://localhost:8000

# ====================================================
# RUNPOD (optionnel - GPT-OSS-20B)
# ====================================================
RUNPOD_API_URL=https://api.runpod.ai/v2/...
RUNPOD_API_KEY=votre-cle-runpod
```

### 6. Configuration OAuth Google

1. Aller sur https://console.cloud.google.com/
2. Créer un nouveau projet ou sélectionner un existant
3. Activer l'API Google+ (ou Google Identity)
4. Créer des identifiants OAuth 2.0 :
   - Type : Application Web
   - **Origines JavaScript autorisées** : `https://votre-domaine.com`
   - **URI de redirection autorisées** : `https://votre-domaine.com/auth/google/callback`
5. Copier le Client ID et Client Secret dans `.env`

### 7. Génération du SESSION_SECRET

```bash
# Générer un secret aléatoire sécurisé
openssl rand -hex 32
```

Copier le résultat dans `.env` pour `SESSION_SECRET`

### 8. Installation des dépendances Node.js

```bash
npm install
```

### 9. Build de l'application React

```bash
npm run build
```

### 10. Configuration du backend Python

```bash
cd "methode workandyou"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 11. Configuration PM2

```bash
# Retour à la racine
cd ~/app

# Créer le fichier ecosystem PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'workandyou-api',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'workandyou-python',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      cwd: './methode workandyou',
      instances: 1,
      env: {
        PYTHONUNBUFFERED: '1'
      },
      error_file: './logs/python-error.log',
      out_file: './logs/python-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF

# Créer le dossier logs
mkdir -p logs

# Démarrer les applications
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Exécuter la commande affichée par PM2
```

### 12. Configuration Nginx

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/workandyou
```

**Contenu :**

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection HTTPS (à configurer après avoir obtenu le certificat SSL)
    # return 301 https://$server_name$request_uri;

    # Configuration temporaire HTTP (avant SSL)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/workandyou /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 13. Configuration SSL avec Let's Encrypt (HTTPS)

```bash
# Installation Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Le renouvellement automatique est configuré par défaut
# Vérifier avec :
sudo certbot renew --dry-run
```

Certbot modifiera automatiquement la configuration Nginx pour activer HTTPS.

### 14. Configuration du pare-feu

```bash
# Autoriser SSH, HTTP et HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le pare-feu
sudo ufw enable
```

## 🔍 Vérification

### 1. Vérifier que les services tournent

```bash
# PM2
pm2 status

# Nginx
sudo systemctl status nginx

# Logs
pm2 logs
```

### 2. Tester l'authentification

1. Aller sur `https://votre-domaine.com`
2. Vous devez être redirigé vers Google OAuth
3. Seuls les emails `@workandyou.fr` peuvent se connecter
4. Après connexion, accès à l'application

### 3. Vérifier les logs

```bash
# Logs API Node.js
pm2 logs workandyou-api

# Logs Python
pm2 logs workandyou-python

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Mises à jour

```bash
# Se connecter au serveur
ssh appuser@votre-ip

cd ~/app

# Récupérer les dernières modifications
git pull

# Réinstaller les dépendances si nécessaire
npm install

# Rebuild le frontend
npm run build

# Redémarrer les services
pm2 restart all

# Ou seulement un service spécifique
pm2 restart workandyou-api
```

## 🛡️ Sécurité

### Points de contrôle

- ✅ AUTH activée en production (vérifié automatiquement si `NODE_ENV=production`)
- ✅ Seuls les emails `@workandyou.fr` autorisés
- ✅ Connexion HTTPS obligatoire
- ✅ Sessions sécurisées avec `SESSION_SECRET`
- ✅ Pare-feu actif (UFW)
- ✅ Application tournant sous utilisateur non-root

### Variables sensibles

**Ne jamais commiter dans Git :**
- `.env`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`
- `GITHUB_PAT`
- `RUNPOD_API_KEY`

## 📊 Monitoring

```bash
# Voir l'utilisation des ressources
pm2 monit

# Voir les processus
htop

# Espace disque
df -h

# Mémoire
free -h
```

## 🆘 Dépannage

### L'auth ne fonctionne pas

1. Vérifier les variables d'environnement :
```bash
pm2 logs workandyou-api | grep AUTH
```

2. Vérifier les logs d'erreur :
```bash
pm2 logs workandyou-api --err
```

3. Vérifier que `NODE_ENV=production` :
```bash
pm2 env 0  # 0 = ID du processus
```

### Erreur de callback OAuth

1. Vérifier que `GOOGLE_CALLBACK_URL` correspond exactement à l'URI configurée dans Google Console
2. Format : `https://votre-domaine.com/auth/google/callback` (avec HTTPS)

### Application inaccessible

1. Vérifier que les services tournent :
```bash
pm2 status
sudo systemctl status nginx
```

2. Vérifier les ports :
```bash
sudo netstat -tlnp | grep -E '(3000|8000|80|443)'
```

3. Vérifier les logs Nginx :
```bash
sudo tail -f /var/log/nginx/error.log
```

## 📝 Commandes utiles

```bash
# Redémarrer tous les services
pm2 restart all

# Voir les logs en temps réel
pm2 logs

# Arrêter tous les services
pm2 stop all

# Supprimer tous les processus
pm2 delete all

# Recharger Nginx
sudo systemctl reload nginx

# Redémarrer Nginx
sudo systemctl restart nginx
```

