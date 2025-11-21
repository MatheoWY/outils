.PHONY: help install dev prod up down logs build rebuild clean status shell

# Variables
COMPOSE_FILE := docker-compose.yml
COMPOSE_DEV_FILE := docker-compose.dev.yml
CONTAINER_NAME := lovable-carte-france

# Commandes d'aide
help: ## Afficher l'aide
	@echo "🐳 Docker WSL 2 - Lovable Carte France"
	@echo ""
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Installation et configuration
install: ## Installer Docker dans WSL 2
	@echo "📦 Installation de Docker..."
	sudo apt update
	sudo apt install -y docker.io docker-compose
	sudo usermod -aG docker $$USER
	@echo "✅ Docker installé. Redémarrez votre terminal WSL."

start-docker: ## Démarrer le service Docker
	@echo "🔄 Démarrage du service Docker..."
	@sudo service docker start || true
	@echo "✅ Docker démarré"

# Mode Production
prod: start-docker ## Lancer en mode production (port 80)
	@echo "🚀 Lancement en mode PRODUCTION..."
	docker-compose up -d
	@echo "✅ Application lancée sur http://localhost"

# Mode Développement
dev: start-docker ## Lancer en mode développement (ports 5173 & 5174)
	@echo "🔧 Lancement en mode DÉVELOPPEMENT..."
	docker-compose -f $(COMPOSE_DEV_FILE) up

# Gestion des conteneurs
up: start-docker ## Lancer les conteneurs (production)
	docker-compose up -d

down: ## Arrêter tous les conteneurs
	@echo "🛑 Arrêt des conteneurs..."
	docker-compose down || true
	docker-compose -f $(COMPOSE_DEV_FILE) down || true
	@echo "✅ Conteneurs arrêtés"

restart: down up ## Redémarrer les conteneurs

# Logs et monitoring
logs: ## Voir les logs en temps réel
	docker-compose logs -f

status: ## Voir le statut des conteneurs
	@echo "📊 Statut des conteneurs Docker:"
	@docker ps -a | grep lovable || echo "Aucun conteneur trouvé"

# Build et rebuild
build: start-docker ## Construire l'image
	@echo "🔨 Construction de l'image..."
	docker-compose build

rebuild: start-docker ## Reconstruire l'image sans cache
	@echo "🔨 Reconstruction complète de l'image..."
	docker-compose build --no-cache

rebuild-up: down rebuild up ## Reconstruire et relancer

# Utilitaires
shell: ## Ouvrir un shell dans le conteneur
	docker exec -it $(CONTAINER_NAME) sh

clean: down ## Nettoyer complètement (conteneurs + images + volumes)
	@echo "🧹 Nettoyage complet..."
	docker-compose down -v || true
	docker-compose -f $(COMPOSE_DEV_FILE) down -v || true
	docker system prune -af
	@echo "✅ Nettoyage terminé"

# Configuration
env: ## Créer le fichier .env depuis le template
	@if [ ! -f .env ]; then \
		echo "📝 Création du fichier .env..."; \
		echo "# Configuration GitHub" > .env; \
		echo "GITHUB_PAT=your_github_token" >> .env; \
		echo "REPO_OWNER=MatheoWY" >> .env; \
		echo "REPO_NAME=signatures" >> .env; \
		echo "BRANCH=main" >> .env; \
		echo "" >> .env; \
		echo "# Configuration API" >> .env; \
		echo "WORKANDYOU_API_URL=" >> .env; \
		echo "" >> .env; \
		echo "# OAuth Google (optionnel)" >> .env; \
		echo "GOOGLE_CLIENT_ID=" >> .env; \
		echo "GOOGLE_CLIENT_SECRET=" >> .env; \
		echo "SESSION_SECRET=changez_moi" >> .env; \
		echo "ALLOWED_DOMAIN=workandyou.fr" >> .env; \
		echo "GOOGLE_CALLBACK_URL=http://localhost:80/auth/google/callback" >> .env; \
		echo "" >> .env; \
		echo "# Environnement" >> .env; \
		echo "NODE_ENV=production" >> .env; \
		echo "PORT=80" >> .env; \
		echo "✅ Fichier .env créé. Éditez-le avec: nano .env"; \
	else \
		echo "⚠️  Le fichier .env existe déjà"; \
	fi

# Tests
health: ## Vérifier la santé de l'application
	@echo "🏥 Vérification de la santé..."
	@curl -s http://localhost/api/health | grep -q "ok" && echo "✅ Application en bonne santé" || echo "❌ Application non disponible"

# Default
.DEFAULT_GOAL := help

