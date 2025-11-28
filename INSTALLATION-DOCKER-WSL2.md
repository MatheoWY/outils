# 🐳 Installation complète de Docker dans WSL 2

## Guide pas à pas pour Windows 11

Ce guide vous accompagne dans l'installation complète de Docker dans WSL 2 Ubuntu sous Windows 11, sans Docker Desktop.

---

## 📋 Prérequis

- Windows 11 (ou Windows 10 version 2004+)
- Droits administrateur sur Windows

---

## 🚀 Étape 1 : Installer WSL 2

### 1.1 Vérifier si WSL est déjà installé

Ouvrez **PowerShell en tant qu'administrateur** :

```powershell
wsl --version
```

Si WSL est installé, vous verrez la version. Passez à l'étape 2.

### 1.2 Installer WSL (si nécessaire)

```powershell
wsl --install
```

**Redémarrez votre ordinateur** après l'installation.

### 1.3 Vérifier la version de WSL

```powershell
wsl --status
```

Assurez-vous que la **version par défaut est 2**.

Si ce n'est pas le cas :

```powershell
wsl --set-default-version 2
```

---

## 🐧 Étape 2 : Installer Ubuntu dans WSL

### 2.1 Installer Ubuntu

```powershell
wsl --install -d Ubuntu
```

ou depuis le **Microsoft Store** :
1. Ouvrir le Microsoft Store
2. Chercher "Ubuntu"
3. Cliquer sur "Obtenir"
4. Attendre la fin de l'installation

### 2.2 Lancer Ubuntu pour la première fois

```powershell
wsl -d Ubuntu
```

À la première ouverture, vous devrez :
1. Créer un nom d'utilisateur (exemple : `mathe`)
2. Créer un mot de passe

**⚠️ Important** : Ce mot de passe sera utilisé pour `sudo`.

### 2.3 Vérifier l'installation

Dans Ubuntu :

```bash
lsb_release -a
```

Devrait afficher :
```
Distributor ID: Ubuntu
Description:    Ubuntu 22.04 LTS
...
```

---

## 🐳 Étape 3 : Installer Docker dans Ubuntu WSL

### 3.1 Mettre à jour les paquets

```bash
sudo apt update
sudo apt upgrade -y
```

### 3.2 Installer Docker

```bash
sudo apt install -y docker.io docker-compose
```

### 3.3 Vérifier l'installation

```bash
docker --version
docker-compose --version
```

Devrait afficher :
```
Docker version 24.x.x, build xxxxx
Docker Compose version v2.x.x
```

---

## ⚙️ Étape 4 : Configuration de Docker

### 4.1 Ajouter votre utilisateur au groupe docker

**Important** : Pour éviter d'utiliser `sudo` à chaque commande Docker :

```bash
sudo usermod -aG docker $USER
```

### 4.2 Démarrer le service Docker

```bash
sudo service docker start
```

### 4.3 Vérifier que Docker tourne

```bash
sudo service docker status
```

Devrait afficher :
```
 * Docker is running
```

### 4.4 Tester Docker

```bash
docker run hello-world
```

Si vous voyez "Hello from Docker!", ça fonctionne ! 🎉

---

## 🔧 Étape 5 : Configuration automatique (optionnel mais recommandé)

### 5.1 Démarrage automatique de Docker

Éditez votre fichier `~/.bashrc` :

```bash
nano ~/.bashrc
```

Ajoutez à la fin :

```bash
# Démarrage automatique de Docker
if ! service docker status > /dev/null 2>&1; then
    sudo service docker start > /dev/null 2>&1
fi
```

Sauvegardez avec `Ctrl+O`, puis `Enter`, puis `Ctrl+X`.

### 5.2 Éviter de taper le mot de passe sudo pour Docker

**⚠️ À utiliser uniquement sur votre machine personnelle**

```bash
echo "$USER ALL=(ALL) NOPASSWD: /usr/sbin/service docker start" | sudo tee -a /etc/sudoers.d/docker-service
```

### 5.3 Recharger la configuration

```bash
source ~/.bashrc
```

Ou fermez et rouvrez le terminal Ubuntu.

---

## 🎯 Étape 6 : Tester votre installation

### 6.1 Vérifier que Docker fonctionne sans sudo

```bash
docker ps
```

Si vous obtenez une liste vide (et pas d'erreur de permission), c'est parfait !

### 6.2 Naviguer vers votre projet

```bash
cd "/mnt/c/Users/mathe/OneDrive/Desktop/Lovable carte france"
```

**💡 Astuce** : Les disques Windows sont montés dans `/mnt/` :
- `C:\` → `/mnt/c/`
- `D:\` → `/mnt/d/`

### 6.3 Lancer un conteneur de test

```bash
docker run --rm nginx:alpine echo "Docker fonctionne dans WSL 2 !"
```

Si vous voyez "Docker fonctionne dans WSL 2 !", tout est OK ! ✅

---

## 📚 Étape 7 : Configuration du projet

### 7.1 Créer le fichier .env

```bash
cd "/mnt/c/Users/mathe/OneDrive/Desktop/Lovable carte france"

cat > .env << 'EOF'
GITHUB_PAT=your_github_token
REPO_OWNER=MatheoWY
REPO_NAME=signatures
BRANCH=main
WORKANDYOU_API_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=changez_cette_chaine_secrete
ALLOWED_DOMAIN=workandyou.fr
GOOGLE_CALLBACK_URL=http://localhost:80/auth/google/callback
NODE_ENV=production
PORT=80
EOF
```

### 7.2 Éditer le fichier .env avec vos valeurs

```bash
nano .env
```

Modifiez les valeurs selon votre configuration.

### 7.3 Rendre les scripts exécutables

```bash
chmod +x start-docker-wsl.sh
```

---

## 🚀 Étape 8 : Premier lancement

### 8.1 Lancer l'application

```bash
./start-docker-wsl.sh
```

Choisissez l'option **1** (Production).

### 8.2 Vérifier que ça fonctionne

Ouvrez un navigateur sur Windows et allez sur :

```
http://localhost
```

Vous devriez voir votre application ! 🎉

### 8.3 Vérifier l'API

```
http://localhost/api/health
```

Devrait afficher :
```json
{"ok":true,"repo":"MatheoWY/signatures","branch":"main"}
```

---

## 🛠️ Commandes utiles après installation

### Démarrer Docker

```bash
sudo service docker start
```

### Arrêter Docker

```bash
sudo service docker stop
```

### Redémarrer Docker

```bash
sudo service docker restart
```

### Voir les conteneurs actifs

```bash
docker ps
```

### Voir tous les conteneurs (même arrêtés)

```bash
docker ps -a
```

### Voir les images téléchargées

```bash
docker images
```

### Nettoyer Docker (libérer de l'espace)

```bash
docker system prune -a
```

---

## 🐛 Problèmes fréquents et solutions

### Problème 1 : "Cannot connect to the Docker daemon"

**Solution** :

```bash
sudo service docker start
```

### Problème 2 : "Permission denied" lors de `docker ps`

**Cause** : Vous n'êtes pas dans le groupe docker

**Solution** :

```bash
sudo usermod -aG docker $USER
```

Puis **fermez et rouvrez** le terminal Ubuntu (ou `exit` puis `wsl -d Ubuntu`).

### Problème 3 : Docker ne démarre pas

**Vérifier les logs** :

```bash
sudo journalctl -u docker
```

**Réinstaller Docker** :

```bash
sudo apt remove docker.io docker-compose
sudo apt autoremove
sudo apt install -y docker.io docker-compose
```

### Problème 4 : "docker-compose: command not found"

**Solution** :

```bash
sudo apt install docker-compose
```

ou installer la version standalone :

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Problème 5 : Conteneur ne démarre pas

**Voir les logs** :

```bash
docker-compose logs -f
```

**Reconstruire l'image** :

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problème 6 : Port 80 déjà utilisé

**Voir qui utilise le port** :

```bash
sudo lsof -i :80
```

**Tuer le processus** (remplacez PID par le numéro affiché) :

```bash
sudo kill -9 PID
```

Ou **modifier le port dans docker-compose.yml** :

```yaml
ports:
  - "8080:80"
```

Puis accéder à `http://localhost:8080`

---

## 🎓 Aller plus loin

### Alias pratiques

Ajoutez dans `~/.bashrc` :

```bash
# Alias Docker
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose down && docker-compose build --no-cache && docker-compose up -d'
alias dps='docker ps'
alias dimg='docker images'

# Alias projet
alias projet='cd "/mnt/c/Users/mathe/OneDrive/Desktop/Lovable carte france"'
```

Rechargez :

```bash
source ~/.bashrc
```

Maintenant vous pouvez utiliser :
- `projet` - aller au projet
- `dcu` - lancer Docker Compose
- `dcd` - arrêter Docker Compose
- `dcl` - voir les logs
- `dps` - voir les conteneurs

### Surveillance des ressources

Voir l'utilisation CPU/RAM des conteneurs :

```bash
docker stats
```

### Ouvrir un shell dans un conteneur

```bash
docker exec -it outils-workandyou sh
```

Pour sortir : `exit`

---

## ✅ Checklist finale

- [ ] WSL 2 installé et activé
- [ ] Ubuntu installé dans WSL
- [ ] Docker installé (`docker --version` fonctionne)
- [ ] Docker Compose installé (`docker-compose --version` fonctionne)
- [ ] Utilisateur ajouté au groupe docker
- [ ] Docker démarre sans erreur (`sudo service docker start`)
- [ ] Test réussi (`docker run hello-world`)
- [ ] Docker fonctionne sans sudo (`docker ps`)
- [ ] Projet accessible (`cd "/mnt/c/Users/mathe/..."`)
- [ ] Fichier `.env` créé et configuré
- [ ] Premier lancement réussi
- [ ] Application accessible sur http://localhost

---

## 🎉 Félicitations !

Vous avez installé avec succès Docker dans WSL 2 !

Votre environnement est maintenant prêt pour :
- ✅ Développer avec Docker
- ✅ Tester en local comme en production
- ✅ Déployer facilement
- ✅ Utiliser tous les outils modernes

---

## 📞 Ressources utiles

- [Documentation officielle Docker](https://docs.docker.com/)
- [Documentation WSL 2](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Compose référence](https://docs.docker.com/compose/compose-file/)

---

## 🔄 Prochaines étapes

1. Lisez [GUIDE-UTILISATION.md](GUIDE-UTILISATION.md) pour l'utilisation quotidienne
2. Consultez [README-DOCKER.md](README-DOCKER.md) pour des détails avancés
3. Utilisez `make help` pour voir toutes les commandes disponibles

---

Bon développement avec Docker ! 🚀

