"""
Script de test pour vérifier la configuration RunPod GPT-OSS-20B
Usage: python test_runpod.py
"""

import os
from dotenv import load_dotenv
import requests

# Charger les variables d'environnement
load_dotenv("../.env")

RUNPOD_API_URL = os.getenv("RUNPOD_API_URL", "")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY", "")

def test_configuration():
    """Teste la configuration RunPod GPT-OSS-20B"""
    
    print("🔍 Vérification de la configuration RunPod GPT-OSS-20B")
    print("=" * 60)
    
    # 1. Vérifier les variables d'environnement
    print("\n1️⃣ Variables d'environnement:")
    print(f"   RUNPOD_API_URL: {'✅ Configurée' if RUNPOD_API_URL else '❌ Vide (mode SIMULATION)'}")
    print(f"   RUNPOD_API_KEY: {'✅ Configurée' if RUNPOD_API_KEY else '❌ Vide (mode SIMULATION)'}")
    
    # 2. Déterminer le mode
    if not RUNPOD_API_URL or not RUNPOD_API_KEY:
        print("\n⚠️  MODE: SIMULATION")
        print("   Le système fonctionnera avec des rapports de démonstration.")
        print("   Pour activer RunPod GPT-OSS-20B, remplissez les variables dans .env:")
        print("   - RUNPOD_API_URL")
        print("   - RUNPOD_API_KEY")
        print("\n💡 Avantages GPT-OSS-20B:")
        print("   - 21B paramètres (3.6B actifs)")
        print("   - MXFP4 quantization (16-20GB VRAM)")
        print("   - RTX 4090 (pas besoin de A100!)")
        print("   - ~$0.007 par analyse (~$3.50/mois pour 500 analyses)")
        print("   - Chain-of-thought natif")
        print("   - Harmony Response Format")
        return False
    
    print("\n✅ MODE: PRODUCTION (RunPod GPT-OSS-20B activé)")
    print(f"   Modèle: openai/gpt-oss-20b")
    
    # 3. Tester la connexion
    print("\n2️⃣ Test de connexion à RunPod:")
    print(f"   URL: {RUNPOD_API_URL}")
    
    try:
        # Test simple avec payload minimal
        test_payload = {
            "input": {
                "files": []  # Payload vide pour test de connexion
            }
        }
        
        response = requests.post(
            RUNPOD_API_URL,
            headers={
                "Authorization": f"Bearer {RUNPOD_API_KEY}",
                "Content-Type": "application/json"
            },
            json=test_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print("   ✅ Connexion réussie !")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"   ⚠️  Réponse non-200: {response.status_code}")
            print(f"   Message: {response.text[:200]}")
            print("   Le système utilisera le fallback simulation en cas d'erreur.")
            return False
            
    except requests.exceptions.Timeout:
        print("   ⚠️  Timeout - RunPod ne répond pas rapidement")
        print("   Le système utilisera le fallback simulation.")
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Erreur de connexion: {str(e)[:100]}")
        print("   Le système utilisera le fallback simulation.")
        return False

def display_info():
    """Affiche les informations sur GPT-OSS-20B"""
    print("\n📖 Informations GPT-OSS-20B:")
    print("   - Paramètres: 21B (3.6B actifs - MoE)")
    print("   - Quantization: MXFP4")
    print("   - VRAM requise: 16-20 GB")
    print("   - GPU recommandé: RTX 4090 24GB")
    print("   - License: Apache 2.0")
    print("   - Reasoning: Configurable (low/medium/high)")
    print("   - Format: Harmony Response")
    print("   - Source: https://huggingface.co/openai/gpt-oss-20b")
    
    print("\n💰 Coûts estimés:")
    print("   - RTX 4090: ~$0.007/analyse (~$3.50/mois pour 500)")
    print("   - A40:      ~$0.010/analyse (~$5.00/mois pour 500)")
    print("   - A100:     ~$0.017/analyse (~$8.50/mois pour 500)")
    
    print("\n⚡ Comparaison avec Mistral-7B:")
    print("   GPT-OSS-20B = 2-3× moins cher + meilleure qualité!")

if __name__ == "__main__":
    print("=" * 60)
    print("  TEST RUNPOD GPT-OSS-20B - MÉTHODE WORK&YOU")
    print("=" * 60)
    print()
    
    success = test_configuration()
    
    display_info()
    
    print()
    print("=" * 60)
    if success:
        print("✅ Configuration RunPod GPT-OSS-20B validée !")
        print("\n🚀 Prochaine étape: Tester avec 4 PDFs")
        print("   http://localhost:5173/methode-workandyou")
    else:
        print("⚠️  Mode simulation actif")
        print("\n📝 Pour activer GPT-OSS-20B:")
        print("   1. Déployer l'image Docker sur RunPod")
        print("   2. Copier l'Endpoint ID et l'API Key")
        print("   3. Remplir RUNPOD_API_URL et RUNPOD_API_KEY dans .env")
        print("   4. Redémarrer les services")
    print("=" * 60)

