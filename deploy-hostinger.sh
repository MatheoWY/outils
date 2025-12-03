#!/bin/bash
# Script de déploiement automatisé pour Hostinger VPS
# Architecture: 2 processus PM2 (Node.js + Python) avec Nginx reverse proxy
# Prérequis sur le serveur:
# - Node.js 20.x installé (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs)
# - Python 3.11+ (apt install -y python3 python3-pip python3-venv)
# - Nginx (apt install -y nginx)
# - PM2 (npm install -g pm2)
# Configuration:
# 1. Cloner le repo: git clone <url> ~/app
# 2. Configurer .env (copier env.example)
# 3. Lancer ce script: bash deploy-hostinger.sh
# 4. Configurer SSL: sudo certbot --nginx -d votre-domaine.com

set -e  # Arrêt en cas d'erreur

echo "🚀 Déploiement Work&You sur Hostinger"
echo "======================================"
echo ""

# Vérifier qu'on est bien sur le serveur
if [ ! -f "/etc/nginx/nginx.conf" ]; then
    echo "❌ Ce script doit être exécuté sur le serveur Hostinger"
    exit 1
fi

# Variables
APP_DIR="$HOME/app"
NGINX_CONF="/etc/nginx/sites-available/workandyou"
PYTHON_DIR="$APP_DIR/methode workandyou"

echo "📍 Répertoire application: $APP_DIR"
echo ""

# 1. Mise à jour du code
echo "📥 Mise à jour du code depuis Git..."
cd "$APP_DIR"
git pull origin main || git pull origin master
echo "✅ Code mis à jour"
echo ""

# 2. Installation des dépendances Node.js
echo "📦 Installation des dépendances Node.js..."
npm install
echo "✅ Dépendances Node.js installées"
echo ""

# 3. Build du frontend React
echo "🔨 Build du frontend React..."
npm run build
echo "✅ Frontend buildé"
echo ""

# 4. Installation des dépendances Python
echo "🐍 Installation des dépendances Python..."
cd "$PYTHON_DIR"
if [ ! -d "venv" ]; then
    echo "   Création de l'environnement virtuel Python..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
deactivate
echo "✅ Dépendances Python installées"
echo ""

# 5. Retour à la racine
cd "$APP_DIR"

# 6. Créer le dossier logs si nécessaire
mkdir -p logs

# 7. Vérifier la configuration .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé!"
    echo "   Copie depuis env.example..."
    cp env.example .env
    echo "⚠️  IMPORTANT: Configurez le fichier .env avant de continuer"
    echo "   nano .env"
    exit 1
fi

# 8. Vérifier les variables critiques
echo "🔍 Vérification de la configuration..."
source .env
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ] || [ -z "$SESSION_SECRET" ]; then
    echo "❌ Variables d'environnement manquantes:"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo "   - SESSION_SECRET"
    echo ""
    echo "   Configurez le fichier .env:"
    echo "   nano .env"
    exit 1
fi
echo "✅ Configuration validée"
echo ""

# 9. Configuration Nginx (si besoin)
if [ ! -f "$NGINX_CONF" ]; then
    echo "📝 Configuration de Nginx..."
    sudo cp nginx.hostinger.conf "$NGINX_CONF"
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/workandyou
    
    echo "⚠️  IMPORTANT: Modifiez le fichier Nginx avec votre nom de domaine:"
    echo "   sudo nano $NGINX_CONF"
    echo ""
    echo "   Puis testez et rechargez:"
    echo "   sudo nginx -t"
    echo "   sudo systemctl reload nginx"
    echo ""
    read -p "Appuyez sur Entrée après avoir configuré Nginx..."
else
    echo "ℹ️  Configuration Nginx déjà présente"
fi
echo ""

# 10. Redémarrer les services PM2
echo "🔄 Redémarrage des services PM2..."

# Arrêter les services existants
pm2 stop all || true

# Démarrer avec la nouvelle configuration
if [ -f "ecosystem.multi.config.js" ]; then
    pm2 start ecosystem.multi.config.js
else
    pm2 start ecosystem.config.js
fi

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique (une seule fois)
pm2 startup || true

echo "✅ Services PM2 redémarrés"
echo ""

# 11. Vérification
echo "🔍 Vérification du déploiement..."
echo ""

echo "📊 État des services PM2:"
pm2 status
echo ""

echo "🌐 État de Nginx:"
sudo systemctl status nginx --no-pager | head -n 3
echo ""

# 12. Tests de connectivité
echo "🧪 Tests de connectivité..."
echo ""

# Test API Node.js
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "✅ API Node.js (port 3000) - OK"
else
    echo "❌ API Node.js (port 3000) - ERREUR"
fi

# Test API Python
if curl -sf http://localhost:8000 > /dev/null; then
    echo "✅ API Python (port 8000) - OK"
else
    echo "⚠️  API Python (port 8000) - Vérifiez les logs"
fi

# Test Nginx
if curl -sf http://localhost > /dev/null; then
    echo "✅ Nginx (port 80) - OK"
else
    echo "❌ Nginx (port 80) - ERREUR"
fi

echo ""
echo "======================================"
echo "✅ Déploiement terminé!"
echo ""
echo "📍 URLs d'accès:"
echo "   🏠 Application: https://votre-domaine.com"
echo "   📊 Carte: https://votre-domaine.com/carte"
echo "   📊 Flux: https://votre-domaine.com/flux"
echo "   ✍️  Signatures: https://votre-domaine.com/signatures"
echo "   🧠 Méthode: https://votre-domaine.com/methode"
echo ""
echo "📋 Commandes utiles:"
echo "   pm2 logs          - Voir les logs"
echo "   pm2 restart all   - Redémarrer les services"
echo "   pm2 monit         - Monitoring en temps réel"
echo ""
echo "🔒 N'oubliez pas de configurer SSL avec:"
echo "   sudo certbot --nginx -d votre-domaine.com"
echo ""

