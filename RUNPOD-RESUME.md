# 📦 Configuration RunPod GPT-OSS-20B BF16 (A40 48GB) - Résumé

## ✅ Configuration optimale pour QUALITÉ MAXIMALE

### 🎯 Modèle : OpenAI GPT-OSS-20B en BF16

**Source**: https://huggingface.co/openai/gpt-oss-20b

| Caractéristique | Valeur |
|-----------------|--------|
| **Paramètres** | 21B (3.6B actifs - MoE) |
| **Format** | **BF16 complet** (qualité maximale) |
| **VRAM requise** | **~40 GB** |
| **GPU** | **A40 48GB** |
| **License** | Apache 2.0 (libre) |
| **Qualité** | ⭐⭐⭐⭐⭐ **MAXIMALE** |
| **Reasoning** | high (configuré) |

### 💰 Configuration A40 48GB BF16

| Configuration | Format | VRAM | Coût/analyse | 500/mois | Qualité |
|---------------|--------|------|--------------|----------|---------|
| **A40 48GB** ⭐ | **BF16** | 40GB | **$0.010-0.012** | **$5-6** | ⭐⭐⭐⭐⭐ |
| RTX 4090 | MXFP4 | 20GB | $0.007 | $3.50 | ⭐⭐⭐⭐ |
| A100 40GB | FP16 | 40GB | $0.017 | $8.50 | ⭐⭐⭐⭐⭐ |

**A40 + BF16 = Meilleur ratio qualité/prix pour analyses premium !**

## 📂 Fichiers recréés

```
Runpod/
├── README.md                    ✅ Vue d'ensemble GPT-OSS-20B
├── Dockerfile                   ✅ Image avec GPT-OSS-20B BAKED
├── handler.py                   ✅ Handler avec Harmony Format
├── requirements.txt             ✅ vLLM spécial gpt-oss
├── model_config.json            ✅ Config complète GPT-OSS-20B
├── prompt_template.txt          ✅ Prompt Work&You V3
├── deploy_runpod.sh             ✅ Script de déploiement
└── .dockerignore                ✅ Optimisation build

env.example                      ✅ Template configuration
```

## 🚀 Déploiement (3 étapes)

### 1. Build image BF16 (15-20 min)

```bash
cd Runpod
docker build -t workandyou-gptoss-bf16:1.0.0 -f Dockerfile .
docker push votre_username/workandyou-gptoss-bf16:1.0.0
```

### 2. Créer endpoint RunPod

- https://www.runpod.io/console/serverless
- Image: `votre_username/workandyou-gptoss-bf16:1.0.0`
- GPU: **A40 48GB** (requis pour BF16!)
- FlashBoot: ✅ ACTIVÉ
- Workers: Min 0, Max 3
- Variables: `GPU_MEMORY_UTILIZATION=0.95`

### 3. Configurer `.env`

```bash
RUNPOD_API_URL=https://api.runpod.ai/v2/ENDPOINT_ID/runsync
RUNPOD_API_KEY=VOTRE_CLE_API
```

## ✨ Avantages GPT-OSS-20B BF16 (A40)

1. **Qualité MAXIMALE** : BF16 complet (16-bit, non-quantized)
2. **Précision totale** : Aucune perte vs modèle original
3. **Cohérence** : Hallucinations minimales
4. **Chain-of-thought** : Reasoning natif optimal
5. **FlashAttention-2** : Performance maximale
6. **A40 48GB** : Configuration parfaite (~40GB utilisés)
7. **Apache 2.0** : Totalement libre
8. **$5-6/mois** : Excellent rapport qualité/prix

## 🎯 Comparaison configurations

| Critère | Mistral-7B | **GPT-OSS-20B BF16** |
|---------|------------|----------------------|
| Paramètres | 7B | 21B (3.6B actifs) |
| Format | FP16 | **BF16 complet** |
| VRAM | 40 GB | **40 GB** |
| GPU | A100 | **A40 48GB** |
| Coût | $8.50/mois | **$5-6/mois** |
| Qualité | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Reasoning | Standard | **Chain-of-thought** |
| FlashAttention | Non | **Oui (FA-2)** |

**GPT-OSS-20B BF16 = Meilleure qualité + Moins cher !**

## 📝 Prochaines étapes

1. ✅ **Fichiers recréés** avec GPT-OSS-20B
2. ⏭️ Build l'image Docker
3. ⏭️ Déployer sur RunPod
4. ⏭️ Tester avec 4 PDFs

**Consultez `Runpod/README.md` pour les détails complets !**

