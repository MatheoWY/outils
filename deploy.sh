#!/bin/bash

# ====================================================
# Script de déploiement automatisé - Work&You
# ====================================================

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement de l'application Work&You..."

# Vérification de l'environnement
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️  NODE_ENV n'est pas en 'production'"
  echo "   Exécuter: export NODE_ENV=production"
  exit 1
fi

# Vérification des variables obligatoires
required_vars=(
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
  "SESSION_SECRET"
  "GITHUB_PAT"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Variables d'environnement manquantes:"
  for var in "${missing_vars[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "   Vérifier le fichier .env"
  exit 1
fi

echo "✅ Variables d'environnement validées"

# Chargement des variables d'environnement
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Installation des dépendances Node.js
echo "📦 Installation des dépendances Node.js..."
npm ci --production=false

# Build du frontend
echo "🏗️  Build du frontend React..."
npm run build

# Vérification du build
if [ ! -d "dist" ]; then
  echo "❌ Échec du build - dossier 'dist' non créé"
  exit 1
fi

echo "✅ Build frontend réussi"

# Configuration du backend Python
echo "🐍 Configuration du backend Python..."
cd "methode workandyou"

if [ ! -d "venv" ]; then
  echo "   Création de l'environnement virtuel..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet

cd ..

echo "✅ Backend Python configuré"

# Création du dossier logs si inexistant
mkdir -p logs

# Redémarrage avec PM2
echo "🔄 Redémarrage des services PM2..."

if pm2 list | grep -q "workandyou"; then
  pm2 restart ecosystem.config.js
  echo "✅ Services redémarrés"
else
  pm2 start ecosystem.config.js
  pm2 save
  echo "✅ Services démarrés"
fi

# Attente de démarrage
sleep 3

# Vérification des services
echo "🔍 Vérification des services..."
pm2 status

# Test de l'API
echo "🧪 Test de l'API..."
if curl -f -s http://localhost:3000/api/health > /dev/null; then
  echo "✅ API Node.js OK"
else
  echo "❌ API Node.js ne répond pas"
  pm2 logs workandyou-api --lines 20
  exit 1
fi

if curl -f -s http://localhost:8000/ > /dev/null; then
  echo "✅ API Python OK"
else
  echo "⚠️  API Python ne répond pas (peut être normal si non utilisée)"
fi

# Vérification de l'authentification
echo "🔒 Vérification de la configuration AUTH..."
if pm2 logs workandyou-api --lines 50 --nostream | grep -q "AUTH ACTIVÉE"; then
  echo "✅ Authentification Google SSO ACTIVÉE"
  echo "   Domaine autorisé: workandyou.fr"
else
  echo "❌ ATTENTION: Authentification NON ACTIVÉE"
  echo "   Vérifier les variables GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET"
  exit 1
fi

# Recharger Nginx si installé
if command -v nginx &> /dev/null; then
  echo "🔄 Rechargement Nginx..."
  sudo systemctl reload nginx
  echo "✅ Nginx rechargé"
fi

echo ""
echo "✅ =========================================="
echo "✅ DÉPLOIEMENT RÉUSSI"
echo "✅ =========================================="
echo ""
echo "📊 Commandes utiles:"
echo "   - Voir les logs:       pm2 logs"
echo "   - Statut des services: pm2 status"
echo "   - Monitoring:          pm2 monit"
echo "   - Redémarrer:          pm2 restart all"
echo ""
echo "🔐 Sécurité:"
echo "   - AUTH: ACTIVÉE ✅"
echo "   - Domaine: @workandyou.fr uniquement"
echo ""

