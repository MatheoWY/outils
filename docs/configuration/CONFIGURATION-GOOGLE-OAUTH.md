# 🔐 Configuration Google OAuth pour outils.workandyou.fr

## 📋 Étapes à suivre AVANT le déploiement

### 1. Accéder à Google Cloud Console

🔗 https://console.cloud.google.com/apis/credentials

### 2. Sélectionner le projet

Le projet OAuth est déjà créé avec les identifiants :
- **Client ID** : `VOTRE_CLIENT_ID.apps.googleusercontent.com`
- **Client Secret** : `VOTRE_CLIENT_SECRET`

### 3. ⚠️ IMPORTANT : Ajouter le domaine de production

Dans **"Identifiants OAuth 2.0"**, cliquer sur votre Client ID existant et ajouter :

#### Origines JavaScript autorisées
```
https://outils.workandyou.fr
```

#### URI de redirection autorisées
```
https://outils.workandyou.fr/auth/google/callback
```

**⚠️ ATTENTION :**
- Utiliser **HTTPS** (pas HTTP)
- Pas de slash final (`/`)
- Respecter exactement la casse

### 4. URIs complètes configurées

Après configuration, vous devriez avoir :

**Origines JavaScript autorisées :**
- `http://localhost:5174` (développement local)
- `http://localhost:5173` (développement Vite)
- `https://outils.workandyou.fr` ✅ (production)

**URI de redirection autorisées :**
- `http://localhost:5174/auth/google/callback` (développement)
- `https://outils.workandyou.fr/auth/google/callback` ✅ (production)

### 5. Sauvegarder

Cliquer sur **"Enregistrer"** en bas de la page.

## 🔍 Vérification

### Sur le serveur de production

Le fichier `.env` doit contenir :

```bash
NODE_ENV=production
GOOGLE_CLIENT_ID=VOTRE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=VOTRE_CLIENT_SECRET
SESSION_SECRET=<NOUVEAU_SECRET_GENERE>
GOOGLE_CALLBACK_URL=https://outils.workandyou.fr/auth/google/callback
ALLOWED_DOMAIN=workandyou.fr
```

### Générer un nouveau SESSION_SECRET

Sur le serveur :
```bash
openssl rand -hex 32
```

Copier le résultat dans `.env` à la place de `<NOUVEAU_SECRET_GENERE>`

## ✅ Test après déploiement

1. Accéder à `https://outils.workandyou.fr`
2. Redirection automatique vers Google OAuth
3. Se connecter avec un compte `@workandyou.fr`
4. Redirection vers l'application

### ❌ Si erreur "redirect_uri_mismatch"

**Cause :** L'URL de callback n'est pas configurée dans Google Console

**Solution :**
1. Vérifier que `https://outils.workandyou.fr/auth/google/callback` est bien dans les URI autorisées
2. Pas de faute de frappe
3. HTTPS (pas HTTP)
4. Sauvegarder dans Google Console
5. Attendre 5-10 minutes que la configuration se propage

### ❌ Si pas de redirection OAuth

**Cause :** Variables d'environnement manquantes ou `NODE_ENV` pas en `production`

**Vérification :**
```bash
pm2 logs workandyou-api | grep AUTH
```

Doit afficher :
```
🔒 AUTH ACTIVÉE - Domaine autorisé: workandyou.fr
   Callback URL: https://outils.workandyou.fr/auth/google/callback
```

Si vous voyez :
```
⚠️ AUTH DÉSACTIVÉE
```

**Solution :** Vérifier le fichier `.env` et redémarrer :
```bash
pm2 restart workandyou-api
pm2 logs workandyou-api
```

## 🔒 Sécurité

### Qui peut accéder ?

✅ **Autorisés :** Tous les comptes email `@workandyou.fr`
❌ **Refusés :** Tous les autres domaines (@gmail.com, @outlook.com, etc.)

### Domaine restreint

Le fichier `server/index.js` contient :
```javascript
const ALLOWED_DOMAIN = (process.env.ALLOWED_DOMAIN || "workandyou.fr").toLowerCase();
```

Seuls les emails se terminant par `@workandyou.fr` peuvent se connecter.

## 📞 Support

### En cas de problème

1. Vérifier les logs PM2 : `pm2 logs workandyou-api`
2. Vérifier Nginx : `sudo tail -f /var/log/nginx/error.log`
3. Vérifier la configuration Google Console
4. Vérifier le fichier `.env` sur le serveur

### Logs à surveiller

```bash
# Logs de l'API
pm2 logs workandyou-api --lines 100

# Vérifier que AUTH est activée
pm2 logs workandyou-api | grep "AUTH ACTIVÉE"

# Logs Nginx
sudo tail -f /var/log/nginx/outils.workandyou.fr-error.log
```

---

## 📝 Résumé des actions OBLIGATOIRES

- [ ] Ajouter `https://outils.workandyou.fr` dans Origines JavaScript autorisées (Google Console)
- [ ] Ajouter `https://outils.workandyou.fr/auth/google/callback` dans URI de redirection (Google Console)
- [ ] Générer un nouveau `SESSION_SECRET` sur le serveur
- [ ] Configurer le fichier `.env` avec `GOOGLE_CALLBACK_URL=https://outils.workandyou.fr/auth/google/callback`
- [ ] S'assurer que `NODE_ENV=production`
- [ ] Redémarrer les services après configuration

**⚠️ Sans ces étapes, l'authentification Google OAuth ne fonctionnera pas en production !**

