"""
Script de test local du handler GPT-OSS-20B
Simule un appel RunPod avec des PDFs de test
"""

import os
import sys
import base64
import json
from pathlib import Path

# Ajouter le répertoire courant au path
sys.path.insert(0, os.path.dirname(__file__))

def create_test_pdf_content(text: str) -> bytes:
    """
    Crée un PDF simple pour les tests
    """
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        from io import BytesIO
        
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.drawString(100, 750, text)
        c.save()
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
    except ImportError:
        print("⚠️  reportlab non installé, utilisation d'un PDF factice")
        return b"PDF_CONTENT_PLACEHOLDER"


def test_handler_local():
    """
    Test du handler en local (sans GPT-OSS-20B, juste la structure)
    """
    print("🧪 Test du handler GPT-OSS-20B en local")
    print("=" * 60)
    print("   Modèle: openai/gpt-oss-20b")
    print("   Format: Harmony Response")
    print("=" * 60)
    
    # Créer des PDFs de test
    test_files = [
        {
            "name": "offre_emploi.pdf",
            "text": "OFFRE D'EMPLOI - Responsable Marketing Digital\nProfil recherché: 5 ans d'expérience..."
        },
        {
            "name": "cv_candidat.pdf",
            "text": "CV - Jean Dupont\nExpérience: 7 ans en marketing digital..."
        },
        {
            "name": "transcription_entretien.pdf",
            "text": "TRANSCRIPTION ENTRETIEN\nCandidat: Je suis passionné par le digital..."
        },
        {
            "name": "rapport_personnalite.pdf",
            "text": "RAPPORT TALENTOBE\nAmbition: 75%, Structure: 65%..."
        }
    ]
    
    # Encoder en base64
    files_encoded = []
    for file_info in test_files:
        pdf_content = create_test_pdf_content(file_info["text"])
        content_b64 = base64.b64encode(pdf_content).decode('utf-8')
        files_encoded.append({
            "name": file_info["name"],
            "content": content_b64
        })
        print(f"  ✅ {file_info['name']} créé")
    
    # Simuler un job RunPod
    job = {
        "input": {
            "files": files_encoded
        }
    }
    
    print("\n📋 Structure du job:")
    print(f"  - Nombre de fichiers: {len(files_encoded)}")
    print(f"  - Taille totale: {sum(len(f['content']) for f in files_encoded)} bytes (base64)")
    
    print("\n⚠️  Note: Ce test vérifie uniquement la structure.")
    print("   Pour tester GPT-OSS-20B complet, déployez sur RunPod.")
    
    # Vérifier que handler.py existe
    handler_path = Path(__file__).parent / "handler.py"
    if handler_path.exists():
        print(f"\n✅ handler.py trouvé: {handler_path}")
        
        # Vérifier le contenu du handler
        with open(handler_path, 'r', encoding='utf-8') as f:
            handler_content = f.read()
            if "openai/gpt-oss-20b" in handler_content:
                print("   ✅ Modèle GPT-OSS-20B configuré")
            if "Harmony" in handler_content or "harmony" in handler_content:
                print("   ✅ Support Harmony Format détecté")
    else:
        print(f"\n❌ handler.py non trouvé: {handler_path}")
        return
    
    # Vérifier le template de prompt
    template_path = Path(__file__).parent / "prompt_template.txt"
    if template_path.exists():
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        print(f"✅ prompt_template.txt trouvé: {len(template_content)} caractères")
    else:
        print(f"❌ prompt_template.txt non trouvé: {template_path}")
        return
    
    # Vérifier Dockerfile
    dockerfile_path = Path(__file__).parent / "Dockerfile"
    if dockerfile_path.exists():
        with open(dockerfile_path, 'r', encoding='utf-8') as f:
            dockerfile_content = f.read()
            if "openai/gpt-oss-20b" in dockerfile_content:
                print("✅ Dockerfile configure GPT-OSS-20B")
            if "MXFP4" in dockerfile_content or "mxfp4" in dockerfile_content:
                print("   ✅ MXFP4 quantization mentionnée")
    
    print("\n" + "=" * 60)
    print("✅ Tous les fichiers nécessaires sont présents")
    print("\n🚀 Prochaine étape: Construire et déployer l'image Docker")
    print("   ./deploy_runpod.sh")
    print("\n💰 Coûts estimés avec RTX 4090:")
    print("   - Par analyse: ~$0.007")
    print("   - 500 analyses/mois: ~$3.50/mois")


def test_pdf_extraction():
    """
    Test l'extraction de texte PDF
    """
    print("\n🧪 Test extraction PDF")
    print("=" * 60)
    
    try:
        from handler import extract_text_from_pdf
        
        # Créer un PDF de test
        pdf_content = create_test_pdf_content("Test extraction avec GPT-OSS-20B.")
        
        # Extraire le texte
        extracted_text = extract_text_from_pdf(pdf_content, "test.pdf")
        
        print(f"📄 Texte extrait: {len(extracted_text)} caractères")
        print(f"   Contenu: {extracted_text[:100]}...")
        
        if extracted_text:
            print("✅ Extraction PDF fonctionne")
        else:
            print("⚠️  Aucun texte extrait")
            
    except Exception as e:
        print(f"❌ Erreur lors du test d'extraction: {str(e)}")


if __name__ == "__main__":
    print("🔬 TESTS RUNPOD HANDLER - GPT-OSS-20B")
    print("=" * 60)
    print()
    
    # Test 1: Structure
    test_handler_local()
    
    # Test 2: Extraction PDF
    test_pdf_extraction()
    
    print("\n" + "=" * 60)
    print("✅ Tous les tests de structure sont terminés")
    print("\n💡 Pour tester l'inference GPT-OSS-20B complète:")
    print("   1. Construire l'image: ./deploy_runpod.sh")
    print("   2. Déployer sur RunPod (RTX 4090 recommandé)")
    print("   3. Tester avec: cd ../methode\\ workandyou && python test_runpod.py")

