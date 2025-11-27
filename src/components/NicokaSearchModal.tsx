import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Briefcase, User, Download, Loader2, Bug } from 'lucide-react';
import { nicokaApi } from '@/services/nicokaApi';
import { testNicokaEndpoints } from '@/services/nicokaApiDebug';
import type { NicokaCandidature } from '@/types/nicoka';

interface NicokaSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDocuments: (files: File[]) => void;
}

export const NicokaSearchModal = ({
  open,
  onOpenChange,
  onSelectDocuments,
}: NicokaSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidatures, setCandidatures] = useState<NicokaCandidature[]>([]);
  const [selectedCandidature, setSelectedCandidature] = useState<NicokaCandidature | null>(null);
  const [error, setError] = useState<string>('');
  const [downloadingDocs, setDownloadingDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadCandidatures();
    }
  }, [open]);

  const loadCandidatures = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading candidatures...');
      const result = await nicokaApi.getCandidatures({ limit: 50 });
      console.log('Candidatures loaded:', result);
      setCandidatures(result.candidatures);
    } catch (err: any) {
      console.error('Error loading candidatures:', err);
      setError(err.message || 'Erreur lors du chargement des candidatures. Vérifiez vos identifiants dans .env.local');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCandidatures();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await nicokaApi.getCandidatures({
        limit: 50,
        search: searchQuery,
      });
      setCandidatures(result.candidatures);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const downloadAndAddDocument = async (url: string, filename: string, type: string) => {
    const docKey = `${url}_${filename}`;
    setDownloadingDocs(prev => new Set(prev).add(docKey));
    
    try {
      const blob = await nicokaApi.downloadDocument(url);
      const file = nicokaApi.blobToFile(blob, filename);
      onSelectDocuments([file]);
    } catch (err: any) {
      setError(`Erreur lors du téléchargement de ${filename}`);
    } finally {
      setDownloadingDocs(prev => {
        const next = new Set(prev);
        next.delete(docKey);
        return next;
      });
    }
  };

  const handleSelectCandidature = (candidature: NicokaCandidature) => {
    setSelectedCandidature(candidature);
  };

  const filteredCandidatures = candidatures.filter(c => {
    const fullName = `${c.candidat.prenom} ${c.candidat.nom}`.toLowerCase();
    const jobTitle = c.job.titre.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || jobTitle.includes(query);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importer depuis Nicoka ATS</DialogTitle>
          <DialogDescription>
            Recherchez une candidature et sélectionnez les documents à importer
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-4 space-y-2">
            <p className="font-semibold">{error}</p>
            {error.includes('404') && (
              <div className="text-xs space-y-1 mt-2 pt-2 border-t border-red-300">
                <p className="font-semibold">Causes possibles :</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Le module "Recrutement" n'est pas activé sur votre compte Nicoka</li>
                  <li>L'utilisateur API n'a pas les permissions nécessaires</li>
                  <li>L'API Recrutement n'est pas disponible sur votre version de Nicoka</li>
                </ul>
                <p className="mt-2">
                  <strong>Solution :</strong> Vérifiez dans Nicoka (Administration → Utilisateur API) que l'utilisateur a accès au module Recrutement.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Barre de recherche */}
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher par nom de candidat ou poste..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
          <Button 
            onClick={() => testNicokaEndpoints()} 
            variant="outline"
            title="Tester les endpoints API"
          >
            <Bug className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : selectedCandidature ? (
          /* Vue détaillée de la candidature */
          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCandidature(null)}
            >
              ← Retour à la liste
            </Button>

            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-semibold text-lg mb-2">
                {selectedCandidature.candidat.prenom} {selectedCandidature.candidat.nom}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <Briefcase className="w-4 h-4 inline mr-1" />
                {selectedCandidature.job.titre}
              </p>
              <p className="text-sm text-muted-foreground">
                Candidature du {new Date(selectedCandidature.date_candidature).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Documents du candidat */}
            {selectedCandidature.candidat.cv_url && (
              <div className="space-y-2">
                <h4 className="font-semibold">CV du candidat</h4>
                <div className="border rounded-md p-3 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">
                        CV - {selectedCandidature.candidat.prenom} {selectedCandidature.candidat.nom}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadAndAddDocument(
                          selectedCandidature.candidat.cv_url!,
                          `CV_${selectedCandidature.candidat.nom}.pdf`,
                          'cv'
                        )
                      }
                      disabled={downloadingDocs.has(`${selectedCandidature.candidat.cv_url}_CV_${selectedCandidature.candidat.nom}.pdf`)}
                    >
                      {downloadingDocs.has(`${selectedCandidature.candidat.cv_url}_CV_${selectedCandidature.candidat.nom}.pdf`) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Importer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents de l'offre */}
            {selectedCandidature.job.documents && selectedCandidature.job.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Offre d'emploi</h4>
                {selectedCandidature.job.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-md p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{doc.nom}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadAndAddDocument(doc.url, doc.nom, 'offre')}
                        disabled={downloadingDocs.has(`${doc.url}_${doc.nom}`)}
                      >
                        {downloadingDocs.has(`${doc.url}_${doc.nom}`) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Importer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes d'entretien */}
            {selectedCandidature.notes_entretien && (
              <div className="space-y-2">
                <h4 className="font-semibold">Notes d'entretien</h4>
                <div className="border rounded-md p-3 bg-background">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedCandidature.notes_entretien}
                  </p>
                </div>
              </div>
            )}

            {/* Actions associées */}
            {selectedCandidature.actions && selectedCandidature.actions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Actions & Documents</h4>
                {selectedCandidature.actions.map((action) => (
                  <div key={action.id} className="border rounded-md p-3 bg-background">
                    <p className="text-sm font-medium mb-2">
                      {action.type} - {new Date(action.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {action.description}
                    </p>
                    {action.documents && action.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{doc.nom}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAndAddDocument(doc.url, doc.nom, 'action')}
                          disabled={downloadingDocs.has(`${doc.url}_${doc.nom}`)}
                        >
                          {downloadingDocs.has(`${doc.url}_${doc.nom}`) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Importer
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Liste des candidatures */
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {filteredCandidatures.length} candidature(s) trouvée(s)
            </p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredCandidatures.map((candidature) => (
                <div
                  key={candidature.id}
                  className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleSelectCandidature(candidature)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {candidature.candidat.prenom} {candidature.candidat.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Briefcase className="w-3 h-3 inline mr-1" />
                        {candidature.job.titre}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

