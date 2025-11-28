# Dockerfile pour RunPod Serverless avec FlashBoot
# Modèle GPT-OSS-20B BAKED en BF16 (qualité maximale pour A40 48GB)

FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04

# Variables d'environnement
ENV DEBIAN_FRONTEND=noninteractive
ENV MODEL_NAME="openai/gpt-oss-20b"
ENV MODEL_DIR="/models"
ENV HF_HOME="/models"
ENV TRANSFORMERS_CACHE="/models"
ENV REASONING_LEVEL="high"
ENV VLLM_USE_MODELSCOPE=False
ENV VLLM_WORKER_MULTIPROC_METHOD=spawn
ENV VLLM_ATTENTION_BACKEND=FLASHINFER
ENV GPU_MEMORY_UTILIZATION=0.95

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    wget \
    curl \
    vim \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-fra \
    && rm -rf /var/lib/apt/lists/*

# Mise à jour pip
RUN pip install --upgrade pip

# Installation de uv pour gestion des dépendances (recommandé par vLLM)
RUN pip install uv

# Installation des dépendances Python avec vLLM spécial pour GPT-OSS
COPY requirements.txt /tmp/requirements.txt
RUN uv pip install --system --pre vllm==0.10.1+gptoss \
    --extra-index-url https://wheels.vllm.ai/gpt-oss/ \
    --extra-index-url https://download.pytorch.org/whl/nightly/cu128 \
    --index-strategy unsafe-best-match

RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Créer le répertoire des modèles
RUN mkdir -p ${MODEL_DIR}

# 🔥 ÉTAPE CRITIQUE : Télécharger et BAKE GPT-OSS-20B en BF16 (qualité maximale)
# Version complète non-quantized pour A40 48GB (~40GB VRAM)
RUN python3 -c "from transformers import AutoTokenizer, AutoModelForCausalLM; \
    import torch; \
    print('📥 Téléchargement de GPT-OSS-20B en BF16 (qualité maximale)...'); \
    print('   VRAM requise: ~40GB (A40 48GB)'); \
    tokenizer = AutoTokenizer.from_pretrained('${MODEL_NAME}', cache_dir='${MODEL_DIR}'); \
    model = AutoModelForCausalLM.from_pretrained('${MODEL_NAME}', \
        cache_dir='${MODEL_DIR}', \
        torch_dtype=torch.bfloat16, \
        device_map='auto', \
        trust_remote_code=True, \
        low_cpu_mem_usage=True); \
    print('✅ GPT-OSS-20B BF16 téléchargé et baked dans l\\'image'); \
    print('   Qualité: Maximale (non-quantized)');"

# Copier le code de l'application
WORKDIR /app
COPY handler.py /app/handler.py
COPY prompt_template.txt /app/prompt_template.txt
COPY model_config.json /app/model_config.json

# Port pour RunPod
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Point d'entrée RunPod
CMD ["python", "-u", "handler.py"]

