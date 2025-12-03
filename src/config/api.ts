// Configuration des URLs d'API selon l'environnement
// Ce fichier centralise toutes les URLs pour faciliter le changement d'environnement

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// En développement, Vite proxy les requêtes vers le serveur local
// En production (Docker ou Hostinger), les requêtes passent directement par Nginx
const API_BASE_URL = isDevelopment 
  ? '' // Utilise le proxy Vite configuré dans vite.config.ts
  : ''; // En production, toutes les requêtes sont sur le même domaine (Nginx)

// URLs des API
export const API_URLS = {
  // API Node.js (Signatures, Auth)
  upload: `${API_BASE_URL}/api/upload`,
  health: `${API_BASE_URL}/api/health`,
  
  // Authentification
  authStatus: `${API_BASE_URL}/auth/status`,
  authGoogle: `${API_BASE_URL}/auth/google`,
  authLogout: `${API_BASE_URL}/auth/logout`,
  
  // API Python (Méthode Work&You)
  submitAnalysis: `${API_BASE_URL}/submit-analysis`,
  
  // Flux externes (proxifiés en dev, direct en prod)
  proxyHellowork: isDevelopment ? '/proxy/hellowork' : 'https://master.nicoka.com/jobboards/hellowork',
  proxyDirectemploi: isDevelopment ? '/proxy/directemploi' : 'https://master.nicoka.com/jobboards/directemploi',
  proxyMeteojob: isDevelopment ? '/proxy/meteojob' : 'https://master.nicoka.com/jobboards/meteojob',
  proxyIndeed: isDevelopment ? '/proxy/indeed' : 'https://master.nicoka.com/jobboards/indeed',
};

// Helper pour faire des requêtes API avec gestion d'erreur
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Helper pour les uploads
export async function uploadFile(
  file: File,
  firstName: string,
  lastName: string
): Promise<{ rawUrl: string; htmlUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);

  const response = await fetch(API_URLS.upload, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erreur d'upload");
  }

  return await response.json();
}

export default API_URLS;

