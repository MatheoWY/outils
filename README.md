# Outils Work&You

Plateforme d'outils internes Work&You comprenant la gestion des agences, la génération de signatures et la méthode Work&You.

## Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Node.js/Express + Python/Flask
- **Data Viz**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router

## Structure du Projet

```
src/
├── components/      # Composants React
├── pages/          # Pages de l'application
├── hooks/          # Hooks personnalisés
├── data/           # Données statiques
├── types/          # Définitions TypeScript
server/             # Backend Node.js
methode workandyou/ # Backend Python
```

## Installation

```bash
# Installer les dépendances frontend
npm install

# Installer les dépendances Python
cd "methode workandyou"
pip install -r requirements.txt
```

## Démarrage

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## Docker

```bash
# Développement
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

## Fonctionnalités

- 🗺️ Carte interactive de la France
- 🏢 Visualisation des agences par département
- 👥 Gestion des personnes et des équipes
- 📊 Flux d'activités
- 🧠 Méthode Work&You (analyse documentaire IA)
- ✍️ Génération de signatures professionnelles

