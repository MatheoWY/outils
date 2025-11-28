# Test direct de l'API Nicoka

Pour vérifier si l'API fonctionne, testez directement avec curl ou Postman :

## 1. Récupérer le token

```bash
curl -X POST https://workandyou.nicoka.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "matheo@workandyou.fr",
    "password": "VOTRE_MOT_DE_PASSE"
  }'
```

Cela devrait retourner :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 2. Tester les endpoints

Une fois que vous avez le token, testez :

```bash
# Remplacez YOUR_TOKEN par le token obtenu

# Test candidats
curl https://workandyou.nicoka.com/api/recrutement/candidat \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test jobs
curl https://workandyou.nicoka.com/api/recrutement/job \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test candidatures
curl https://workandyou.nicoka.com/api/recrutement/candidature \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 3. Vérifications dans Nicoka

1. **Vérifier les modules actifs :**
   - Connectez-vous à https://workandyou.nicoka.com
   - Menu "Administration" → Vérifiez que le module "Recrutement" est actif

2. **Vérifier l'utilisateur API :**
   - Menu "Administration" → "Utilisateur API"
   - Vérifiez que l'utilisateur `matheo@workandyou.fr` a les bonnes permissions
   - Il doit avoir accès au module "Recrutement"

3. **Contacter le support Nicoka :**
   - Si rien ne fonctionne, contactez le support Nicoka
   - Demandez si l'API "Recrutement" est disponible sur votre instance
   - Vérifiez la version de Nicoka ATS que vous utilisez

