# ⚡ Configuration rapide - Développement local

## ✅ Fichier `.env.local` créé !

Toutes vos variables sont configurées sauf **une seule** :

## 🔑 Il vous manque : GITHUB_PAT

### Étapes pour créer votre token GitHub :

1. **Aller sur :** https://github.com/settings/tokens/new

2. **Remplir le formulaire :**
   - **Note** : `Work&You Signatures Upload`
   - **Expiration** : 90 jours (ou No expiration)
   - **Permissions** : Cocher `repo` (full control)

3. **Cliquer sur** : `Generate token`

4. **Copier le token** (commence par `ghp_...`)

5. **Ouvrir `.env.local`** et compléter :
   ```
   GITHUB_PAT=ghp_VotreTok3nG3n3r3ICI
   ```

## 🌐 Google OAuth - URI à ajouter

Dans [Google Console](https://console.cloud.google.com/apis/credentials) :

1. Sélectionner votre Client OAuth (`125802179909-...`)
2. Ajouter dans **"URI de redirection autorisées"** :
   ```
   http://localhost:5174/auth/google/callback
   http://localhost:5173/auth/google/callback
   ```
3. Sauvegarder

## 🚀 Démarrer l'application

```powershell
# Démarrer les 2 services (frontend + backend)
npm run dev
```

Ou séparément :

```powershell
# Terminal 1 - Frontend React
npm run dev:web

# Terminal 2 - Backend Node.js
npm run dev:api

# Terminal 3 - Backend Python (optionnel)
cd "methode workandyou"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## ✅ Vérifications

| Variable | Statut |
|----------|--------|
| `GOOGLE_CLIENT_ID` | ✅ Configuré |
| `GOOGLE_CLIENT_SECRET` | ✅ Configuré |
| `SESSION_SECRET` | ✅ Généré |
| `GITHUB_PAT` | ⚠️ À compléter |
| Callbacks Google Console | ⚠️ À vérifier |

## 🔒 Sécurité

- ✅ `.env.local` est ignoré par Git
- ✅ Ne jamais commiter vos secrets
- ✅ En développement, l'AUTH est désactivée
- ✅ En production, l'AUTH s'activera automatiquement

## 📝 Fichiers de configuration

| Fichier | Usage | Git |
|---------|-------|-----|
| `env.example` | Template vide (pour documentation) | ✅ Versionné |
| `.env.local` | Votre config locale avec secrets | ❌ Ignoré |
| `.env` (sur serveur) | Config production | ❌ Ignoré |

## 🎯 Une fois configuré

Accéder à : http://localhost:5174

**En développement :**
- Pas besoin d'authentification
- L'application fonctionne directement

**En production :**
- Authentification Google SSO obligatoire
- Seuls les `@workandyou.fr` autorisés

