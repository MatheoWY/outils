# 📁 Guide des Fichiers Docker

Ce document explique le rôle de chaque fichier Docker créé pour le projet.

---

## 🐳 Fichiers Docker principaux

### `Dockerfile`
**Type** : Image Docker production
**Utilisation** : Build optimisé multi-stage pour la production

```dockerfile
# Build en 2 étapes :
# 1. Compilation du frontend (Vite)
# 2. Copie du build + serveur Express
```

**Caractéristiques** :
- ✅ Image Alpine (légère)
- ✅ Multi-stage build
- ✅ Production-ready
- ✅ Port 80
- ✅ NODE_ENV=production

**Quand l'utiliser** : Pour déployer en production

---

### `Dockerfile.dev`
**Type** : Image Docker développement
**Utilisation** : Développement avec hot-reload

```dockerfile
# Simple :
# 1. Installation des dépendances
# 2. Lancement de npm run dev
```

**Caractéristiques** :
- ✅ Code source monté en volume
- ✅ Hot-reload activé
- ✅ Ports 5173 (Vite) + 5174 (Express)
- ✅ NODE_ENV=development

**Quand l'utiliser** : Pour développer localement avec Docker

---

### `docker-compose.yml`
**Type** : Orchestration Docker production
**Utilisation** : Lancer l'application en production

```yaml
services:
  app:
    build: Dockerfile
    ports: "80:80"
    environment: production
```

**Caractéristiques** :
- ✅ Service unique
- ✅ Port 80
- ✅ Health check intégré
- ✅ Restart automatique
- ✅ Variables d'environnement depuis .env

**Commande** : `docker-compose up -d`

---

### `docker-compose.dev.yml`
**Type** : Orchestration Docker développement
**Utilisation** : Lancer l'application en développement

```yaml
services:
  dev:
    build: Dockerfile.dev
    ports: "5173:5173" et "5174:5174"
    volumes: code source monté
```

**Caractéristiques** :
- ✅ Service de développement
- ✅ Ports 5173 + 5174
- ✅ Volumes montés (hot-reload)
- ✅ Variables d'environnement depuis .env

**Commande** : `docker-compose -f docker-compose.dev.yml up`

---

### `.dockerignore`
**Type** : Exclusions Docker
**Utilisation** : Fichiers à ne pas copier dans l'image

```
node_modules/
dist/
.git/
*.md
.env
```

**Avantages** :
- ✅ Build plus rapide
- ✅ Image plus légère
- ✅ Pas de fichiers sensibles (.env)

---

## 🔧 Scripts d'automatisation

### `start-docker.ps1`
**Type** : Script PowerShell
**Plateforme** : Windows 11
**Utilisation** : Lancer Docker depuis PowerShell

```powershell
.\start-docker.ps1
```

**Fonctionnalités** :
- Menu interactif
- Conversion des chemins Windows → WSL
- Options production/développement
- Gestion des logs
- Rebuild d'image

**Quand l'utiliser** : Depuis PowerShell Windows

---

### `start-docker-wsl.sh`
**Type** : Script Bash
**Plateforme** : WSL 2 Ubuntu
**Utilisation** : Lancer Docker depuis WSL

```bash
./start-docker-wsl.sh
```

**Fonctionnalités** :
- Menu interactif
- Vérification de Docker
- Création du .env si absent
- Options production/développement
- Démarrage automatique de Docker

**Quand l'utiliser** : Depuis WSL Ubuntu

---

### `Makefile`
**Type** : Automatisation Make
**Plateforme** : WSL 2 Ubuntu
**Utilisation** : Commandes simplifiées

```bash
make help     # Liste des commandes
make prod     # Production
make dev      # Développement
make logs     # Logs
make down     # Arrêter
make rebuild  # Reconstruire
```

**Avantages** :
- ✅ Commandes courtes
- ✅ Auto-documentation
- ✅ Démarrage automatique de Docker
- ✅ Gestion complète du cycle de vie

**Quand l'utiliser** : Pour les utilisateurs avancés dans WSL

---

## 📚 Documentation

### `README.md`
**Type** : Documentation principale
**Contenu** :
- Vue d'ensemble du projet
- Installation et configuration
- Commandes Docker
- Variables d'environnement
- Structure du projet

**Audience** : Tous les utilisateurs

---

### `README-DOCKER.md`
**Type** : Guide Docker complet
**Contenu** :
- Installation de Docker dans WSL 2
- Configuration détaillée
- Toutes les commandes Docker
- Dépannage avancé
- Workflow recommandé

**Audience** : Utilisateurs voulant tout comprendre

---

### `DEMARRAGE-RAPIDE-WSL.md`
**Type** : Guide de démarrage rapide
**Contenu** :
- Étapes d'installation
- Commandes essentielles
- Astuces pratiques
- Alias utiles

**Audience** : Utilisateurs pressés

---

### `GUIDE-UTILISATION.md`
**Type** : Guide d'utilisation illustré
**Contenu** :
- Pour les pressés
- Installation pas à pas
- Utilisation quotidienne
- Problèmes fréquents
- Conseils pratiques

**Audience** : Débutants

---

### `FICHIERS-DOCKER.md` (ce fichier)
**Type** : Référence des fichiers
**Contenu** :
- Description de chaque fichier
- Rôle et utilisation
- Quand l'utiliser

**Audience** : Pour comprendre l'organisation

---

## 🗂️ Récapitulatif par cas d'usage

### Je veux démarrer rapidement (Production)

**Fichiers utilisés** :
- `start-docker.ps1` (Windows) ou `start-docker-wsl.sh` (WSL)
- `docker-compose.yml`
- `Dockerfile`
- `.env`

**Commande** :
```powershell
.\start-docker.ps1  # Choisir option 1
```

---

### Je veux développer avec hot-reload

**Fichiers utilisés** :
- `start-docker.ps1` (Windows) ou `start-docker-wsl.sh` (WSL)
- `docker-compose.dev.yml`
- `Dockerfile.dev`
- `.env`

**Commande** :
```powershell
.\start-docker.ps1  # Choisir option 2
```

---

### Je veux utiliser des commandes courtes

**Fichiers utilisés** :
- `Makefile`
- `docker-compose.yml` ou `docker-compose.dev.yml`
- `Dockerfile` ou `Dockerfile.dev`
- `.env`

**Commandes** :
```bash
make prod   # Production
make dev    # Développement
make logs   # Logs
```

---

### Je veux comprendre Docker

**Fichiers à lire** :
1. `README-DOCKER.md` - Guide complet
2. `GUIDE-UTILISATION.md` - Guide pratique
3. `docker-compose.yml` - Configuration production
4. `Dockerfile` - Image production

---

### Je veux déployer en production

**Fichiers utilisés** :
- `docker-compose.yml`
- `Dockerfile`
- `.env` (configurer les variables)

**Processus** :
1. Configurer `.env` avec les bonnes valeurs
2. `docker-compose build`
3. `docker-compose up -d`

---

## 📊 Matrice de compatibilité

| Fichier | Windows PowerShell | WSL Bash | Linux natif |
|---------|-------------------|----------|-------------|
| `start-docker.ps1` | ✅ | ❌ | ❌ |
| `start-docker-wsl.sh` | ❌ | ✅ | ✅ |
| `Makefile` | ❌ | ✅ | ✅ |
| `docker-compose.yml` | ✅* | ✅ | ✅ |
| `docker-compose.dev.yml` | ✅* | ✅ | ✅ |

*Via WSL en arrière-plan

---

## 🎯 Arbre de décision

```
Vous êtes sur ?
├─ Windows 11
│  ├─ PowerShell → start-docker.ps1
│  └─ WSL Ubuntu
│     ├─ Débutant → start-docker-wsl.sh
│     └─ Avancé → Makefile
└─ Linux natif
   ├─ Débutant → start-docker-wsl.sh
   └─ Avancé → Makefile ou docker-compose
```

---

## 💡 Conseils de choix

### Utilisez `start-docker.ps1` si :
- ✅ Vous êtes sur Windows 11
- ✅ Vous voulez un menu interactif
- ✅ Vous ne voulez pas ouvrir WSL

### Utilisez `start-docker-wsl.sh` si :
- ✅ Vous êtes dans WSL
- ✅ Vous voulez un menu interactif
- ✅ Vous êtes débutant avec Docker

### Utilisez `Makefile` si :
- ✅ Vous êtes dans WSL
- ✅ Vous aimez les commandes courtes
- ✅ Vous êtes à l'aise avec le terminal

### Utilisez `docker-compose` directement si :
- ✅ Vous êtes expert Docker
- ✅ Vous voulez un contrôle total
- ✅ Vous scriptez le déploiement

---

## 📝 Checklist de vérification

Avant de démarrer, vérifiez que vous avez :

- [ ] `Dockerfile` - Image production
- [ ] `Dockerfile.dev` - Image développement
- [ ] `docker-compose.yml` - Orchestration production
- [ ] `docker-compose.dev.yml` - Orchestration développement
- [ ] `.dockerignore` - Exclusions
- [ ] `.env` - Variables d'environnement (à créer)
- [ ] `start-docker.ps1` - Script Windows
- [ ] `start-docker-wsl.sh` - Script WSL
- [ ] `Makefile` - Commandes Make
- [ ] `README.md` - Doc principale
- [ ] `README-DOCKER.md` - Guide Docker complet
- [ ] `DEMARRAGE-RAPIDE-WSL.md` - Guide rapide
- [ ] `GUIDE-UTILISATION.md` - Guide illustré
- [ ] `FICHIERS-DOCKER.md` - Ce fichier

---

Tous les fichiers sont en place ! 🎉

