# ✅ Checklist de déploiement en production

## 🔐 Sécurité & Authentification

- [ ] Variables OAuth Google configurées dans `.env`
  - [ ] `GOOGLE_CLIENT_ID` 
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `SESSION_SECRET` (généré avec `openssl rand -hex 32`)
- [ ] Callback URL configuré dans Google Console
  - [ ] Format: `https://VOTRE-DOMAINE.com/auth/google/callback`
  - [ ] Exactement identique dans `.env` et Google Console
- [ ] `NODE_ENV=production` dans `.env`
- [ ] `ALLOWED_DOMAIN=workandyou.fr` vérifié
- [ ] Vérification : logs affichent "🔒 AUTH ACTIVÉE"

## 🔑 GitHub & API

- [ ] `GITHUB_PAT` configuré (pour upload signatures)
  - [ ] Permissions: `repo` activées
  - [ ] Token valide et non expiré
- [ ] `REPO_OWNER` et `REPO_NAME` corrects
- [ ] (Optionnel) `RUNPOD_API_KEY` si GPT-OSS-20B utilisé

## 🖥️ Serveur

- [ ] VPS Hostinger configuré (min 4GB RAM recommandé)
- [ ] Domaine pointant vers IP du serveur
- [ ] Ubuntu 22.04/24.04 LTS installé
- [ ] Node.js 20.x installé
- [ ] Python 3.11+ installé
- [ ] Nginx installé et configuré
- [ ] PM2 installé globalement
- [ ] Certificat SSL Let's Encrypt actif (HTTPS)
- [ ] Pare-feu UFW configuré (ports 22, 80, 443)

## 📦 Application

- [ ] Dépendances Node.js installées (`npm install`)
- [ ] Build frontend réussi (`npm run build`)
- [ ] Dossier `dist/` créé avec succès
- [ ] Backend Python configuré (venv + requirements.txt)
- [ ] Fichier `ecosystem.config.js` présent
- [ ] Fichier `.env` présent (copié depuis `.env.production.example`)

## 🚀 Services

- [ ] PM2 démarré : `pm2 start ecosystem.config.js`
- [ ] Services sauvegardés : `pm2 save`
- [ ] Démarrage automatique : `pm2 startup` exécuté
- [ ] Nginx redémarré : `sudo systemctl restart nginx`
- [ ] API Node.js répond : `curl http://localhost:3000/api/health`
- [ ] API Python répond : `curl http://localhost:8000/`

## 🧪 Tests

- [ ] Accès à `https://VOTRE-DOMAINE.com` fonctionne
- [ ] Redirection automatique vers Google OAuth
- [ ] Connexion avec email `@workandyou.fr` fonctionne
- [ ] Connexion avec autre domaine est REFUSÉE
- [ ] Toutes les pages du site sont accessibles après connexion
- [ ] Upload de signature fonctionne
- [ ] Génération de signatures fonctionne
- [ ] Méthode Work&You accessible

## 📊 Monitoring

- [ ] `pm2 status` affiche les 2 services en `online`
- [ ] `pm2 logs` ne montre pas d'erreurs critiques
- [ ] Logs Nginx clean : `/var/log/nginx/error.log`
- [ ] Utilisation RAM acceptable : `free -h`
- [ ] Utilisation disque OK : `df -h`

## 🔒 Vérifications de sécurité finales

- [ ] Fichier `.env` n'est PAS commité dans Git
- [ ] Fichier `.env` appartient à l'utilisateur de l'app (pas root)
- [ ] Permissions `.env` restrictives : `chmod 600 .env`
- [ ] Application tourne avec utilisateur non-root
- [ ] Port 3000 non exposé publiquement (proxy Nginx)
- [ ] Port 8000 non exposé publiquement (local uniquement)
- [ ] Sessions cookies sécurisées (HTTPS only)
- [ ] Authentification testée et vérifiée ✅

## 📝 Documentation

- [ ] Fichier `.env` sauvegardé en lieu sûr (gestionnaire de mots de passe)
- [ ] Identifiants Google OAuth sauvegardés
- [ ] IP du serveur notée
- [ ] Accès SSH configuré et testé

---

## ⚠️ IMPORTANT

**L'authentification Google SSO est OBLIGATOIRE en production.**

Le code active automatiquement l'auth si :
- `NODE_ENV=production`
- `GOOGLE_CLIENT_ID` non vide
- `GOOGLE_CLIENT_SECRET` non vide
- `SESSION_SECRET` non vide

**Sans ces variables, l'application refusera de démarrer en mode sécurisé.**

Vérifier dans les logs au démarrage :
```
🔒 AUTH ACTIVÉE - Domaine autorisé: workandyou.fr
   Callback URL: https://votre-domaine.com/auth/google/callback
```

Si vous voyez :
```
⚠️  AUTH DÉSACTIVÉE
```
**L'application n'est PAS sécurisée !**

