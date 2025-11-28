export interface NicokaCandidat {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  cv_url?: string;
  documents?: NicokaDocument[];
}

export interface NicokaJob {
  id: number;
  titre: string;
  description: string;
  reference?: string;
  documents?: NicokaDocument[];
}

export interface NicokaCandidature {
  id: number;
  candidat: NicokaCandidat;
  job: NicokaJob;
  date_candidature: string;
  statut?: string;
  notes_entretien?: string;
  actions?: NicokaAction[];
}

export interface NicokaAction {
  id: number;
  type: string;
  description: string;
  date: string;
  documents?: NicokaDocument[];
}

export interface NicokaDocument {
  id: number;
  nom: string;
  url: string;
  type: string;
}

export interface NicokaAuthResponse {
  token: string;
}

export interface NicokaSearchResult {
  candidatures: NicokaCandidature[];
  total: number;
}

