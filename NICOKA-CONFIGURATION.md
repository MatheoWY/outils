# Configuration Nicoka ATS

## Variables d'environnement

Pour configurer l'intégration avec l'API Nicoka, créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Nicoka ATS
VITE_NICOKA_SUBDOMAIN=votre-sous-domaine
VITE_NICOKA_LOGIN=votre-email@exemple.com
VITE_NICOKA_PASSWORD=votre-mot-de-passe

# Si vous utilisez un compte d'essai
VITE_NICOKA_TRIAL=false
```

## Configuration

### 1. Compte de production

Pour un compte Nicoka en production :
- **URL API** : `https://{subdomain}.nicoka.com/api/`
- **VITE_NICOKA_SUBDOMAIN** : Votre sous-domaine Nicoka
- **VITE_NICOKA_TRIAL** : `false` (ou omettez cette variable)

Exemple :
```env
VITE_NICOKA_SUBDOMAIN=monentreprise
VITE_NICOKA_LOGIN=api@monentreprise.com
VITE_NICOKA_PASSWORD=MotDePasseSecurise123
VITE_NICOKA_TRIAL=false
```

### 2. Compte d'essai

Pour un compte d'essai Nicoka :
- **URL API** : `https://trial.nicoka.com/{subdomain}/api/`
- **VITE_NICOKA_SUBDOMAIN** : Votre sous-domaine d'essai
- **VITE_NICOKA_TRIAL** : `true`

Exemple :
```env
VITE_NICOKA_SUBDOMAIN=trial-entreprise
VITE_NICOKA_LOGIN=test@exemple.com
VITE_NICOKA_PASSWORD=TestPassword123
VITE_NICOKA_TRIAL=true
```

## Utilisateur API

Il est **fortement recommandé** de créer un utilisateur dédié pour l'API :

1. Connectez-vous à Nicoka
2. Allez dans **Administration** → **Utilisateur API**
3. Créez un nouvel utilisateur API
4. Utilisez l'email et le mot de passe de cet utilisateur dans votre fichier `.env`

## Fonctionnalités disponibles

### Recherche de candidatures

L'intégration permet de :
- Rechercher des candidatures par nom de candidat ou poste
- Visualiser les détails d'une candidature (candidat + offre)
- Importer automatiquement :
  - ✅ Le CV du candidat
  - ✅ L'offre d'emploi (documents associés)
  - ✅ Les notes d'entretien
  - ✅ Les documents des actions associées

### Utilisation dans l'application

1. Allez sur la page **Méthode Work&You**
2. Cliquez sur **"Importer depuis Nicoka ATS"**
3. Recherchez une candidature
4. Sélectionnez la candidature pour voir les détails
5. Importez les documents souhaités en cliquant sur **"Importer"**
6. Les documents sont automatiquement ajoutés à votre analyse

## Sécurité

⚠️ **Important** :
- Ne commitez **JAMAIS** votre fichier `.env` dans Git
- Utilisez des mots de passe forts pour l'utilisateur API
- Limitez les permissions de l'utilisateur API au strict nécessaire
- Renouvelez le token avant expiration (durée de vie : 1 an)

## Dépannage

### Erreur d'authentification
- Vérifiez que vos identifiants sont corrects
- Vérifiez que l'utilisateur API existe et est actif
- Vérifiez que le sous-domaine est correct

### Documents non trouvés
- Assurez-vous que les documents sont bien attachés à la candidature dans Nicoka
- Vérifiez les permissions de l'utilisateur API

### Timeout
- Augmentez le timeout dans `src/services/nicokaApi.ts` si nécessaire
- Vérifiez votre connexion internet

