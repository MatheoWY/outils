# ✅ Vérification des permissions Nicoka

## 1. Vérifier que le module Recrutement est activé

1. Connectez-vous à https://workandyou.nicoka.com
2. Menu **Administration** → **Modules** (ou **Paramètres**)
3. Vérifiez que le module **"Recrutement"** ou **"ATS"** est bien **activé** avec une coche verte

## 2. Vérifier les permissions de l'utilisateur API

1. Menu **Administration** → **Utilisateur API**
2. Cliquez sur **"API METHODE WORKANDYOU"**
3. Regardez la section **"Modules autorisés"** ou **"Permissions"**
4. Cochez **"Recrutement"** si ce n'est pas déjà fait
5. **Sauvegardez**

## 3. Vérifier le profil de l'utilisateur

L'utilisateur API a le profil **"Administrateur"** mais il faut peut-être :
- Lui donner des permissions explicites sur le module Recrutement
- Créer un profil spécifique "API" avec accès au module Recrutement

## 4. Alternatives si le module Recrutement n'existe pas

Si votre version de Nicoka n'a pas le module "Recrutement ATS", vous devrez peut-être :
- Contacter le support Nicoka pour activer le module
- Vérifier que votre licence inclut le module ATS
- Utiliser d'autres modules disponibles (CRM, Contacts, etc.)

## 5. Test avec d'autres modules

Pour tester si l'API fonctionne, essayez d'accéder à d'autres modules :
- `/crm/contact` (Contacts)
- `/crm/compte` (Comptes clients)
- `/sirh/collaborateur` (Collaborateurs)

