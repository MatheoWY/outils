/**
 * Script pour créer automatiquement le fichier .env s'il n'existe pas
 * Exécuté automatiquement avant npm dev
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  Fichier .env introuvable.');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Création du fichier .env depuis env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Fichier .env créé !');
    console.log('');
    console.log('💡 Par défaut, le système fonctionne en mode SIMULATION.');
    console.log('   Pour activer RunPod avec GPT-OSS-20B, éditez .env et remplissez :');
    console.log('   - RUNPOD_API_URL');
    console.log('   - RUNPOD_API_KEY');
    console.log('');
    console.log('🎯 GPT-OSS-20B: 21B paramètres, MXFP4, seulement 16GB VRAM');
    console.log('   GPU recommandé: RTX 4090 (~$3.50/mois pour 500 analyses)');
    console.log('');
  } else {
    console.log('❌ Fichier env.example introuvable !');
    console.log('   Créez manuellement un fichier .env à la racine du projet.');
    process.exit(1);
  }
} else {
  console.log('✅ Fichier .env trouvé.');
}

