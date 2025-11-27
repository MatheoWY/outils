#!/bin/bash

# Script pour lancer le projet dans Docker via WSL 2
# Assurez-vous d'avoir Docker installé dans votre WSL 2 Ubuntu

set -e

echo "🐳 Démarrage du projet Outils Work&You dans Docker WSL 2"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé dans WSL 2"
    echo "Pour installer Docker dans WSL 2 Ubuntu, exécutez:"
    echo ""
    echo "  sudo apt update"
    echo "  sudo apt install -y docker.io docker-compose"
    echo "  sudo usermod -aG docker \$USER"
    echo "  sudo service docker start"
    echo ""
    exit 1
fi

# Vérifier si le service Docker est en cours d'exécution
if ! sudo service docker status &> /dev/null; then
    echo "🔄 Démarrage du service Docker..."
    sudo service docker start
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "⚠️  Aucun fichier .env trouvé"
    echo "📝 Création d'un fichier .env à partir de .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer avec vos valeurs."
    echo ""
fi

# Demander le mode (production ou développement)
echo "Choisissez le mode d'exécution:"
echo "1) Production (port 80)"
echo "2) Développement avec hot-reload (ports 5173 et 5174)"
read -p "Votre choix (1 ou 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Lancement en mode PRODUCTION..."
        echo ""
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo ""
        echo "✅ Application lancée en mode production sur http://localhost"
        echo "📊 Pour voir les logs: docker-compose logs -f"
        echo "🛑 Pour arrêter: docker-compose down"
        ;;
    2)
        echo ""
        echo "🔧 Lancement en mode DÉVELOPPEMENT..."
        echo ""
        docker-compose -f docker-compose.dev.yml down
        docker-compose -f docker-compose.dev.yml build --no-cache
        docker-compose -f docker-compose.dev.yml up
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

