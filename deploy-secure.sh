#!/bin/bash

# Script de déploiement sécurisé pour l'application Work&You
# Vérifie la configuration, build et démarre l'architecture unifiée avec auth

set -e  # Arrêter en cas d'erreur

echo "========================================="
echo "🔒 DÉPLOIEMENT SÉCURISÉ WORK&YOU"
echo "========================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}❌ ERREUR: $1${NC}"
    exit 1
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docker-compose.simple.yml" ]; then
    error "Fichier docker-compose.simple.yml non trouvé. Êtes-vous dans le bon répertoire ?"
fi
success "Répertoire de travail correct"

# 2. Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    error "Fichier .env non trouvé. Copiez env.example vers .env et configurez-le."
fi
success "Fichier .env trouvé"

# 3. Vérifier les variables d'environnement critiques
echo ""
echo "Vérification des variables d'environnement..."

check_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env | cut -d'=' -f2-)
    
    if [ -z "$var_value" ] || [ "$var_value" = "votre_valeur" ] || [ "$var_value" = "changeme" ]; then
        error "Variable ${var_name} non configurée dans .env"
    fi
    success "${var_name} configurée"
}

check_var "GOOGLE_CLIENT_ID"
check_var "GOOGLE_CLIENT_SECRET"
check_var "SESSION_SECRET"
check_var "GOOGLE_CALLBACK_URL"
check_var "N8N_BASIC_AUTH_PASSWORD"

# 4. Vérifier que Docker est installé et fonctionne
echo ""
echo "Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé"
fi
success "Docker installé"

if ! docker ps &> /dev/null; then
    error "Docker n'est pas démarré ou vous n'avez pas les permissions"
fi
success "Docker fonctionne"

# 5. Arrêter les anciens conteneurs
echo ""
echo "Arrêt des anciens conteneurs..."
docker-compose -f docker-compose.multi.yml down 2>/dev/null || warning "Anciens conteneurs déjà arrêtés"
docker-compose -f docker-compose.simple.yml down 2>/dev/null || warning "Conteneurs simple déjà arrêtés"
success "Anciens conteneurs arrêtés"

# 6. Nettoyer les images non utilisées (optionnel)
echo ""
echo "Nettoyage des images Docker non utilisées..."
docker image prune -f > /dev/null
success "Images nettoyées"

# 7. Build et démarrage des nouveaux conteneurs
echo ""
echo "Build et démarrage de l'architecture unifiée..."
echo "⏳ Cela peut prendre 3-5 minutes..."
docker-compose -f docker-compose.simple.yml up -d --build

# 8. Attendre que les services soient prêts
echo ""
echo "Attente du démarrage des services..."
sleep 20

# 9. Vérifier l'état des conteneurs
echo ""
echo "Vérification de l'état des conteneurs..."
if ! docker ps | grep -q "workandyou-app"; then
    error "Le conteneur workandyou-app n'est pas démarré"
fi
success "Conteneur app démarré"

if ! docker ps | grep -q "workandyou-nginx"; then
    error "Le conteneur workandyou-nginx n'est pas démarré"
fi
success "Conteneur nginx démarré"

# 10. Tests de connectivité
echo ""
echo "Tests de connectivité..."

# Test health check
if curl -sf http://localhost/health > /dev/null; then
    success "Health check OK"
else
    error "Health check échoué"
fi

# Test HTTPS (si certificats présents)
if [ -d "/etc/letsencrypt/live/outils.workandyou.fr" ]; then
    if curl -sf https://localhost/ > /dev/null 2>&1; then
        success "HTTPS OK"
    else
        warning "HTTPS non accessible (certificats peut-être invalides)"
    fi
fi

# 11. Afficher les logs récents
echo ""
echo "Logs récents de l'application:"
echo "---"
docker logs workandyou-app --tail 10
echo "---"

# 12. Résumé final
echo ""
echo "========================================="
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS"
echo "========================================="
echo ""
echo "🌐 Application accessible sur:"
echo "   http://localhost (local)"
echo "   https://outils.workandyou.fr (production)"
echo ""
echo "📋 Services déployés:"
echo "   • Application principale (avec auth Google)"
echo "   • API Python (méthode)"
echo "   • n8n (workflow automation)"
echo ""
echo "🔒 Sécurité:"
echo "   • Authentification Google OAuth obligatoire"
echo "   • Domaine autorisé: workandyou.fr"
echo "   • Toutes les pages protégées"
echo ""
echo "📊 Commandes utiles:"
echo "   • Voir les logs: docker logs workandyou-app -f"
echo "   • Redémarrer: docker-compose -f docker-compose.simple.yml restart"
echo "   • Arrêter: docker-compose -f docker-compose.simple.yml down"
echo ""

