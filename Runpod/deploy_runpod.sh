#!/bin/bash
# Script de déploiement RunPod Serverless avec GPT-OSS-20B
# Usage: ./deploy_runpod.sh

set -e

echo "🚀 Déploiement RunPod - GPT-OSS-20B BF16 - Méthode Work&You"
echo "============================================================"

# Configuration
IMAGE_NAME="workandyou-gptoss-bf16"
REGISTRY="docker.io"
USERNAME="${DOCKER_USERNAME:-votre_username}"
VERSION="1.0.0"

FULL_IMAGE="${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"

echo ""
echo "📦 Image à construire : ${FULL_IMAGE}"
echo "   Modèle: openai/gpt-oss-20b"
echo "   Format: BF16 complet (qualité maximale)"
echo "   VRAM requise: ~40GB (A40 48GB)"
echo ""

# 1. Build de l'image Docker avec GPT-OSS-20B BF16 BAKED
echo "🔨 Construction de l'image Docker (15-20 minutes)..."
echo "   ⚠️  GPT-OSS-20B BF16 sera téléchargé (~40GB) et intégré dans l'image"
echo "   Format: BF16 complet pour qualité maximale"
docker build -t ${IMAGE_NAME}:${VERSION} -f Dockerfile .

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Image construite avec succès"
echo ""

# 2. Tag de l'image
echo "🏷️  Tag de l'image..."
docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE}
docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest

echo "✅ Image taguée"
echo ""

# 3. Push vers le registry
echo "📤 Push de l'image vers le registry..."
echo "   (Assurez-vous d'être connecté: docker login)"

read -p "Voulez-vous pusher l'image maintenant ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker push ${FULL_IMAGE}
    docker push ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest
    echo "✅ Image pushée avec succès"
else
    echo "⏭️  Push ignoré"
fi

echo ""
echo "🎯 Prochaines étapes :"
echo ""
echo "1. Créer un endpoint serverless sur RunPod :"
echo "   - Aller sur : https://www.runpod.io/console/serverless"
echo "   - Cliquer sur 'New Endpoint'"
echo "   - Sélectionner 'Custom Image'"
echo "   - Image : ${FULL_IMAGE}"
echo "   - GPU : A40 48GB (requis pour BF16)"
echo "   - FlashBoot : ACTIVÉ ✅"
echo "   - Workers : Min 0, Max 3"
echo "   - Timeout : 120s"
echo ""
echo "2. Configurer les variables d'environnement :"
echo "   MODEL_NAME=openai/gpt-oss-20b"
echo "   MODEL_DIR=/models"
echo "   REASONING_LEVEL=high"
echo "   GPU_MEMORY_UTILIZATION=0.95"
echo ""
echo "3. Copier l'URL de l'endpoint et la clé API"
echo ""
echo "4. Mettre à jour votre fichier .env :"
echo "   RUNPOD_API_URL=https://api.runpod.ai/v2/[ENDPOINT_ID]/runsync"
echo "   RUNPOD_API_KEY=votre_cle_api"
echo ""
echo "5. Tester avec :"
echo "   cd ../methode\\ workandyou"
echo "   python test_runpod.py"
echo ""
echo "💰 Coûts estimés avec A40 48GB (BF16) :"
echo "   - Par analyse : ~$0.010-0.012"
echo "   - 500 analyses/mois : ~$5.00-6.00/mois"
echo "   - Qualité : ⭐⭐⭐⭐⭐ MAXIMALE (BF16 complet)"
echo ""
echo "✨ Avantages BF16 :"
echo "   - Précision 16-bit complète"
echo "   - Aucune perte de qualité"
echo "   - Cohérence maximale"
echo "   - FlashAttention-2 activé"
echo ""
echo "✅ Déploiement préparé avec succès !"

