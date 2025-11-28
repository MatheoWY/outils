import type {
  NicokaAuthResponse,
  NicokaCandidature,
  NicokaCandidat,
  NicokaJob,
  NicokaSearchResult,
  NicokaAction
} from '@/types/nicoka';

// Debug des variables d'environnement
console.log('=== DEBUG ENV NICOKA ===');
console.log('VITE_NICOKA_SUBDOMAIN:', import.meta.env.VITE_NICOKA_SUBDOMAIN);
console.log('VITE_NICOKA_TOKEN:', import.meta.env.VITE_NICOKA_TOKEN ? 'DÉFINI (✅ Recommandé)' : 'NON DÉFINI');
console.log('VITE_NICOKA_LOGIN:', import.meta.env.VITE_NICOKA_LOGIN ? 'DÉFINI' : 'NON DÉFINI');
console.log('VITE_NICOKA_PASSWORD:', import.meta.env.VITE_NICOKA_PASSWORD ? 'DÉFINI' : 'NON DÉFINI');
console.log('VITE_NICOKA_TRIAL:', import.meta.env.VITE_NICOKA_TRIAL);
console.log('========================');

class NicokaApiService {
  private token: string | null = null;
  private baseUrl: string;
  private subdomain: string;

  constructor() {
    this.subdomain = (import.meta.env.VITE_NICOKA_SUBDOMAIN || '').trim();
    
    // Nettoyer le subdomain (enlever http://, https://, .nicoka.com, etc.)
    this.subdomain = this.subdomain
      .replace(/^https?:\/\//, '')
      .replace(/\.nicoka\.com.*$/, '')
      .replace(/^trial\.nicoka\.com\//, '')
      .split('/')[0];
    
    // En production : https://{subdomain}.nicoka.com/api/
    // En trial : https://trial.nicoka.com/{subdomain}/api/
    const isTrial = import.meta.env.VITE_NICOKA_TRIAL === 'true';
    this.baseUrl = isTrial
      ? `https://trial.nicoka.com/${this.subdomain}/api`
      : `https://${this.subdomain}.nicoka.com/api`;
    
    console.log('Nicoka API initialized:', {
      rawSubdomain: import.meta.env.VITE_NICOKA_SUBDOMAIN,
      cleanedSubdomain: this.subdomain,
      baseUrl: this.baseUrl,
      isTrial,
    });
  }

  /**
   * Authentification à l'API Nicoka
   */
  async authenticate(login?: string, password?: string): Promise<string> {
    // Priorité 1 : Utiliser un token pré-généré si disponible
    const preGeneratedToken = import.meta.env.VITE_NICOKA_TOKEN;
    if (preGeneratedToken) {
      console.log('Using pre-generated token from .env.local');
      this.token = preGeneratedToken;
      return preGeneratedToken;
    }

    // Priorité 2 : Authentification avec login/password
    const authLogin = login || import.meta.env.VITE_NICOKA_LOGIN;
    const authPassword = password || import.meta.env.VITE_NICOKA_PASSWORD;

    if (!authLogin || !authPassword) {
      throw new Error('Identifiants Nicoka non configurés dans .env.local (VITE_NICOKA_TOKEN ou VITE_NICOKA_LOGIN/PASSWORD)');
    }

    console.log('Authenticating with Nicoka API...', {
      login: authLogin,
      baseUrl: this.baseUrl,
    });

    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: authLogin,
          password: authPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Authentication failed:', errorText);
        throw new Error(`Échec de l'authentification Nicoka (${response.status}): Vérifiez vos identifiants`);
      }

      const data: NicokaAuthResponse = await response.json();
      this.token = data.token;
      console.log('Authentication successful');
      return data.token;
    } catch (error) {
      console.error('Erreur d\'authentification Nicoka:', error);
      throw error;
    }
  }

  /**
   * Vérification du token
   */
  async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.authenticate();
    }
  }
  
  /**
   * Récupérer le token actuel (pour debug)
   */
  getToken(): string | null {
    return this.token;
  }
  
  /**
   * Récupérer l'URL de base (pour debug)
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Récupérer toutes les candidatures
   */
  async getCandidatures(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<NicokaSearchResult> {
    await this.ensureAuthenticated();

    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}/recrutement/candidature${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('Fetching candidatures from:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      return {
        candidatures: data.data || data || [],
        total: data.total || (data.data ? data.data.length : 0),
      };
    } catch (error) {
      console.error('Erreur getCandidatures:', error);
      throw error;
    }
  }

  /**
   * Récupérer une candidature par ID
   */
  async getCandidature(id: number): Promise<NicokaCandidature> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(
        `${this.baseUrl}/recrutement/candidature/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la candidature');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getCandidature:', error);
      throw error;
    }
  }

  /**
   * Récupérer un candidat par ID
   */
  async getCandidat(id: number): Promise<NicokaCandidat> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(
        `${this.baseUrl}/recrutement/candidat/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du candidat');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getCandidat:', error);
      throw error;
    }
  }

  /**
   * Récupérer un job par ID
   */
  async getJob(id: number): Promise<NicokaJob> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(
        `${this.baseUrl}/recrutement/job/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du job');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getJob:', error);
      throw error;
    }
  }

  /**
   * Récupérer les actions d'une candidature
   */
  async getActions(candidatureId: number): Promise<NicokaAction[]> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(
        `${this.baseUrl}/recrutement/action?candidature_id=${candidatureId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actions');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur getActions:', error);
      throw error;
    }
  }

  /**
   * Télécharger un document
   */
  async downloadDocument(documentUrl: string): Promise<Blob> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(documentUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du document');
      }

      return await response.blob();
    } catch (error) {
      console.error('Erreur downloadDocument:', error);
      throw error;
    }
  }

  /**
   * Convertir un Blob en File
   */
  blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type });
  }
}

export const nicokaApi = new NicokaApiService();

