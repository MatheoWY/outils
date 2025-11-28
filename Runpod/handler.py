"""
RunPod Handler pour Méthode Work&You avec GPT-OSS-20B
Analyse de documents RH avec LLM OpenAI open-weight
Utilise le Harmony Response Format pour chain-of-thought
"""

import os
import re
import json
import base64
import tempfile
from typing import Dict, List, Optional
import runpod
from io import BytesIO

# PDF processing
import PyPDF2
import pdfplumber

# LLM inference avec GPT-OSS-20B
from transformers import pipeline
import torch

# Configuration
MODEL_NAME = os.getenv("MODEL_NAME", "openai/gpt-oss-20b")
MODEL_DIR = os.getenv("MODEL_DIR", "/models")
REASONING_LEVEL = os.getenv("REASONING_LEVEL", "high")  # low, medium, high
GPU_MEMORY_UTILIZATION = float(os.getenv("GPU_MEMORY_UTILIZATION", "0.95"))

# Paramètres LLM optimisés pour qualité maximale (A40 48GB)
GENERATION_CONFIG = {
    "max_new_tokens": 8192,
    "temperature": 0.7,
    "top_k": 40,
    "top_p": 0.95,
    "min_p": 0.05,  # Améliore la cohérence
    "do_sample": True,
    "repetition_penalty": 1.1,
    # Paramètres additionnels pour qualité maximale
    "num_beams": 1,  # Greedy pour cohérence (ou 2-3 pour diversité)
    "length_penalty": 1.0,
    "early_stopping": False,
}

# Initialisation globale du modèle (une seule fois au démarrage)
print("🚀 Initialisation du modèle GPT-OSS-20B en BF16...")
print(f"   Modèle: {MODEL_NAME}")
print(f"   Format: BF16 complet (qualité maximale)")
print(f"   GPU: A40 48GB")
print(f"   VRAM utilisée: ~{int(40 * GPU_MEMORY_UTILIZATION)}GB")
print(f"   Reasoning level: {REASONING_LEVEL}")

# Utilisation du pipeline transformers qui applique automatiquement le Harmony Format
pipe = pipeline(
    "text-generation",
    model=MODEL_NAME,
    torch_dtype=torch.bfloat16,
    device_map="auto",
    model_kwargs={
        "cache_dir": MODEL_DIR,
        "trust_remote_code": True,
        "low_cpu_mem_usage": True,
        "use_flash_attention_2": True,  # FlashAttention-2 pour performance
    }
)

print("✅ GPT-OSS-20B BF16 chargé et prêt (qualité maximale)")

# Charger le template de prompt
with open("/app/prompt_template.txt", "r", encoding="utf-8") as f:
    PROMPT_TEMPLATE = f.read()


def extract_text_from_pdf(pdf_bytes: bytes, filename: str = "document.pdf") -> str:
    """
    Extrait le texte d'un PDF (natif, pas d'OCR nécessaire selon specs)
    """
    try:
        # Méthode 1 : PyPDF2 (rapide)
        pdf_file = BytesIO(pdf_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_parts = []
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            if text.strip():
                text_parts.append(f"[Page {page_num + 1}]\n{text}")
        
        if text_parts:
            return "\n\n".join(text_parts)
        
        # Méthode 2 : pdfplumber (fallback, plus robuste)
        pdf_file.seek(0)
        with pdfplumber.open(pdf_file) as pdf:
            text_parts = []
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text and text.strip():
                    text_parts.append(f"[Page {page_num + 1}]\n{text}")
            
            if text_parts:
                return "\n\n".join(text_parts)
        
        return f"[Erreur : Impossible d'extraire le texte de {filename}]"
        
    except Exception as e:
        print(f"❌ Erreur extraction PDF {filename}: {str(e)}")
        return f"[Erreur extraction : {filename}]"


def extract_content_from_harmony(text: str) -> str:
    """
    Extrait le contenu utile du Harmony Response Format
    Ignore la partie <think>...</think> (chain-of-thought interne)
    """
    # Supprimer la section <think>
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL | re.IGNORECASE)
    return text.strip()


def parse_reports(llm_output: str) -> Dict[str, str]:
    """
    Parse la sortie LLM pour extraire les 4 rapports
    Compatible avec le Harmony Response Format
    """
    # D'abord, extraire le contenu utile (sans <think>)
    clean_output = extract_content_from_harmony(llm_output)
    
    reports = {
        "raw_report": "",
        "client_report": "",
        "consultant_report": "",
        "candidate_report": ""
    }
    
    # Patterns de détection des rapports avec les balises HTML
    patterns = {
        "raw_report": r"<!-- RAPPORT_BRUT_START -->(.*?)<!-- RAPPORT_BRUT_END -->",
        "client_report": r"<!-- RAPPORT_CLIENT_START -->(.*?)<!-- RAPPORT_CLIENT_END -->",
        "consultant_report": r"<!-- RAPPORT_CONSULTANT_START -->(.*?)<!-- RAPPORT_CONSULTANT_END -->",
        "candidate_report": r"<!-- RAPPORT_CANDIDAT_START -->(.*?)<!-- RAPPORT_CANDIDAT_END -->"
    }
    
    for report_key, pattern in patterns.items():
        match = re.search(pattern, clean_output, re.DOTALL | re.IGNORECASE)
        if match:
            content = match.group(1).strip()
            # Ajouter les styles CSS inline pour le rendu HTML
            styled_content = add_report_styles(content)
            reports[report_key] = styled_content
        else:
            print(f"⚠️  Rapport {report_key} non trouvé dans la sortie LLM")
            reports[report_key] = f"<p>Erreur : Rapport {report_key} non généré correctement</p>"
    
    return reports


def add_report_styles(html_content: str) -> str:
    """
    Ajoute les styles CSS inline au HTML pour un rendu parfait
    """
    css_prefix = """
<style>
.rapport-brut, .rapport-client, .rapport-consultant, .rapport-candidat {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
    max-width: 900px;
    margin: 0 auto;
}
.rapport-brut h3, .rapport-client h3, .rapport-consultant h3, .rapport-candidat h3 {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
    margin-top: 20px;
}
.rapport-brut h4, .rapport-client h4, .rapport-consultant h4, .rapport-candidat h4 {
    color: #34495e;
    margin-top: 20px;
    margin-bottom: 10px;
}
.scoring-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.scoring-table thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
.scoring-table th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
}
.scoring-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #ecf0f1;
}
.scoring-table tbody tr:hover {
    background-color: #f8f9fa;
}
.note {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 10px;
    margin: 15px 0;
    font-style: italic;
}
.score-global {
    background-color: #d1ecf1;
    border-left: 4px solid #17a2b8;
    padding: 15px;
    margin: 20px 0;
    font-size: 1.1em;
}
ul, ol {
    margin: 10px 0;
    padding-left: 25px;
}
li {
    margin: 8px 0;
}
p {
    margin: 12px 0;
    text-align: justify;
}
strong {
    color: #2c3e50;
}
</style>
"""
    
    # Injecter le CSS avant le contenu
    if not html_content.startswith("<style>"):
        html_content = css_prefix + html_content
    
    return html_content


def handler(job: Dict) -> Dict:
    """
    Handler principal RunPod
    
    Input attendu :
    {
        "input": {
            "prompt": "string (optionnel, utilise le template par défaut)",
            "files": [
                {
                    "name": "offre.pdf",
                    "content": "base64_encoded_bytes"
                },
                {
                    "name": "cv.pdf",
                    "content": "base64_encoded_bytes"
                },
                ...
            ]
        }
    }
    
    Output :
    {
        "raw_report": "HTML",
        "client_report": "HTML",
        "consultant_report": "HTML",
        "candidate_report": "HTML"
    }
    """
    try:
        job_input = job.get("input", {})
        
        # Récupérer les fichiers
        files = job_input.get("files", [])
        if not files or len(files) < 4:
            return {
                "error": f"4 fichiers PDF requis (offre, CV, transcription, personnalité). Reçu : {len(files)}"
            }
        
        print(f"📄 Traitement de {len(files)} fichiers PDF...")
        
        # Extraire le texte de chaque PDF
        documents = {}
        doc_mapping = {
            0: "offre_emploi",
            1: "cv_candidat",
            2: "transcription_entretien",
            3: "rapport_personnalite"
        }
        
        for idx, file_data in enumerate(files[:4]):
            filename = file_data.get("name", f"document_{idx}.pdf")
            content_b64 = file_data.get("content", "")
            
            # Décoder base64
            try:
                pdf_bytes = base64.b64decode(content_b64)
            except Exception as e:
                return {"error": f"Erreur décodage base64 pour {filename}: {str(e)}"}
            
            # Extraire texte
            text = extract_text_from_pdf(pdf_bytes, filename)
            doc_key = doc_mapping.get(idx, f"document_{idx}")
            documents[doc_key] = text
            print(f"  ✅ {filename} → {len(text)} caractères extraits")
        
        # Construire le prompt complet avec instruction de reasoning level
        system_prompt = f"Reasoning: {REASONING_LEVEL}\n\n"
        
        user_prompt = PROMPT_TEMPLATE.format(
            offre_emploi=documents.get("offre_emploi", "[Non fourni]"),
            cv_candidat=documents.get("cv_candidat", "[Non fourni]"),
            transcription_entretien=documents.get("transcription_entretien", "[Non fourni]"),
            rapport_personnalite=documents.get("rapport_personnalite", "[Non fourni]")
        )
        
        # Messages format pour le pipeline (applique automatiquement Harmony Format)
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        print(f"🧠 Génération des rapports avec GPT-OSS-20B (reasoning: {REASONING_LEVEL})...")
        print(f"   Prompt: {len(user_prompt)} caractères")
        
        # Appel au LLM via pipeline (Harmony Format appliqué automatiquement)
        outputs = pipe(
            messages,
            **GENERATION_CONFIG
        )
        
        generated_text = outputs[0]["generated_text"][-1]["content"]
        
        print(f"✅ GPT-OSS-20B response: {len(generated_text)} caractères")
        
        # Parser les 4 rapports
        reports = parse_reports(generated_text)
        
        # Vérifier que tous les rapports ont été générés
        missing_reports = [k for k, v in reports.items() if not v or "Erreur" in v]
        if missing_reports:
            print(f"⚠️  Rapports incomplets: {missing_reports}")
        
        print("✅ Analyse terminée avec succès")
        return reports
        
    except Exception as e:
        print(f"❌ Erreur dans handler: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "error": f"Erreur lors du traitement: {str(e)}"
        }


# Point d'entrée RunPod
runpod.serverless.start({"handler": handler})

