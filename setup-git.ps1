# Script pour initialiser et publier le projet sur GitHub
# À exécuter après l'installation de Git

# Initialiser le dépôt Git
git init

# Ajouter le remote GitHub
git remote add origin git@github.com:MatheoWY/m-thode-workandyou.git

# Ajouter tous les fichiers
git add .

# Créer le commit initial
git commit -m "Initial commit: Projet carte France avec React + TypeScript"

# Renommer la branche en main
git branch -M main

# Pousser vers GitHub
git push -u origin main

Write-Host "✓ Projet publié sur GitHub avec succès!" -ForegroundColor Green

