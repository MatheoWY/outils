# 🔐 Configuration des identifiants Nicoka

## 📍 Où mettre vos identifiants ?

Créez un fichier `.env.local` à la **racine du projet** (à côté de `package.json`)

## ✅ Méthode 1 : Avec jeton d'accès (RECOMMANDÉ)

**Avantages :** Plus simple, plus sécurisé, dure 1 an

**Comment générer le jeton :**
1. Connectez-vous à https://workandyou.nicoka.com
2. Menu **Administration** → **Utilisateur API**
3. Cliquez sur votre utilisateur API
4. Cliquez sur **"Afficher le jeton d'accès"**
5. Copiez le jeton

**Fichier `.env.local` :**
```env
VITE_NICOKA_SUBDOMAIN=workandyou
VITE_NICOKA_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIx...
```

## 🔄 Méthode 2 : Avec login/password (Alternative)

```env
VITE_NICOKA_SUBDOMAIN=workandyou
VITE_NICOKA_LOGIN=api@workandyou.fr
VITE_NICOKA_PASSWORD=MonMotDePasse123!
```

## 📝 Pour un compte d'essai

Ajoutez cette ligne :
```env
VITE_NICOKA_TRIAL=true
```

## ⚠️ Important

- Le fichier `.env.local` ne sera **jamais commité** sur Git (c'est sécurisé)
- Utilisez un **utilisateur API dédié** dans Nicoka (Menu Administration → Utilisateur API)
- Redémarrez le serveur de développement après avoir créé le fichier

## 🚀 Pour tester

1. Créez le fichier `.env.local` avec vos identifiants
2. Redémarrez l'application : `npm run dev`
3. Allez sur la page "Méthode Work&You"
4. Cliquez sur "Importer depuis Nicoka ATS"

Si tout est bien configuré, vous verrez la liste de vos candidatures !

---

📖 Pour plus de détails, consultez `NICOKA-CONFIGURATION.md`

