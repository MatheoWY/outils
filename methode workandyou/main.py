from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List
import requests  # Pour appeler Runpod
import os
import shutil
import base64
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env parent
load_dotenv("../.env")

app = FastAPI()

# Monter les fichiers statiques (frontend React build)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Le dossier de gabarits dans ce projet est "template" (et non "templates")
if os.path.exists("template"):
    templates = Jinja2Templates(directory="template")
else:
    templates = None

# Configuration RunPod (depuis variables d'environnement)
RUNPOD_API_URL = os.getenv("RUNPOD_API_URL", "")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY", "")

# Détection automatique du mode
USE_RUNPOD = bool(RUNPOD_API_URL and RUNPOD_API_KEY)

if USE_RUNPOD:
    print(f"✅ Mode PRODUCTION : GPT-OSS-20B activé")
    print(f"   URL: {RUNPOD_API_URL}")
else:
    print(f"⚠️  Mode SIMULATION : Identifiants RunPod non configurés")

# 1. Servir le site web (le fichier HTML)
@app.get("/", response_class=HTMLResponse)
async def get_frontend(request: Request):
    # En production Docker, servir le build React
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    # En développement, utiliser le template
    elif templates:
        return templates.TemplateResponse("index.html", {"request": request})
    else:
        return HTMLResponse(content="<h1>Méthode Work&You</h1><p>Service en cours de démarrage...</p>", status_code=200)

# 2. Endpoint qui reçoit les fichiers de l'utilisateur
@app.post("/submit-analysis")
async def handle_analysis_request(
    prompt: str = Form(...), 
    files: List[UploadFile] = File(...)
):
    
    # 3. Préparer les données à envoyer à Runpod
    # Nous devons lire les fichiers et les envoyer.
    # 'requests' peut gérer l'envoi de "multipart/form-data"
    
    files_to_send = []
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)

    try:
        # 'requests' a besoin des fichiers sous un format spécifique
        # (nom, contenu_binaire, type_mime)
        for file in files:
            file_path = os.path.join(temp_dir, file.filename)
            
            # Enregistrer temporairement le fichier
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # L'ouvrir pour 'requests'
            files_to_send.append(
                ('files', (file.filename, open(file_path, 'rb'), file.content_type))
            )

        # Les données "texte" (le prompt)
        data_to_send = {'prompt': prompt}

        # 4. L'APPEL API A RUNPOD (Basculement automatique)
        # ==========================================================
        if USE_RUNPOD:
            # MODE PRODUCTION : Appel réel à RunPod avec GPT-OSS-20B
            print(f"🚀 Envoi de la requête à RunPod (GPT-OSS-20B)")
            print(f"   URL: {RUNPOD_API_URL}")
            
            # Préparer les fichiers au format attendu par RunPod (base64)
            files_payload = []
            for file in files:
                file_path = os.path.join(temp_dir, file.filename)
                with open(file_path, 'rb') as f:
                    file_content = f.read()
                    file_b64 = base64.b64encode(file_content).decode('utf-8')
                    files_payload.append({
                        "name": file.filename,
                        "content": file_b64
                    })
            
            # Format JSON pour RunPod serverless
            runpod_payload = {
                "input": {
                    "prompt": prompt,
                    "files": files_payload
                }
            }
            
            response = requests.post(
                RUNPOD_API_URL,
                headers={
                    "Authorization": f"Bearer {RUNPOD_API_KEY}",
                    "Content-Type": "application/json"
                },
                json=runpod_payload,
                timeout=120  # Timeout de 2 minutes
            )
            
            response.raise_for_status()  # Lève une erreur si l'appel échoue
            result = response.json()
            
            print(f"✅ Réponse GPT-OSS-20B reçue avec succès")
            
            # RunPod peut retourner {"output": {...}} ou directement {...}
            if "output" in result:
                result = result["output"]
        
        else:
            # MODE SIMULATION : Fallback automatique
            print(f"⚠️  Mode SIMULATION activé (identifiants RunPod non configurés)")
            
            import time
            time.sleep(1)  # Simule un court temps de réponse
            
            result = {
                "raw_report": f"[RAPPORT BRUT - SIMULATION]\nPrompt: {prompt}\nTableau pondérations...\nDétails...",
                "client_report": "[RAPPORT CLIENT - SIMULATION]\nSynthèse, score global, couleur, points de vigilance...",
                "consultant_report": "[RAPPORT CONSULTANT - SIMULATION]\nForces, faiblesses, recommandations, citations, pistes...",
                "candidate_report": "[RAPPORT CANDIDAT - SIMULATION]\nPoints forts, axes, conseils, ton bienveillant..."
            }
        # ==========================================================

        return result

    except requests.exceptions.Timeout:
        return {"error": "Timeout : RunPod n'a pas répondu dans les délais (120s)"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Erreur de connexion RunPod : {str(e)}"}
    except Exception as e:
        return {"error": f"Erreur lors de l'analyse : {str(e)}"}
    
    finally:
        # Nettoyer les fichiers temporaires
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)