import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Workflow, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const N8n = () => {
  const [n8nUrl, setN8nUrl] = useState<string>("");
  const [isProduction, setIsProduction] = useState<boolean>(false);

  useEffect(() => {
    // Déterminer l'URL n8n en fonction de l'environnement
    // En dev local (5173/5174): n8n non disponible
    // En production: via nginx /n8n
    const isDev = window.location.port === '5173' || window.location.port === '5174';
    setIsProduction(!isDev);
    
    if (!isDev) {
      const baseUrl = window.location.origin;
      setN8nUrl(`${baseUrl}/n8n`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">n8n Automation</h1>
                  <p className="text-sm text-muted-foreground">
                    Automatisation de workflows et intégrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!isProduction && (
            <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle>Mode Développement</AlertTitle>
              <AlertDescription>
                n8n n'est disponible qu'en production (serveur Hostinger avec Docker).
                En développement local, seuls le frontend React et l'API Node.js sont actifs.
                <br />
                <strong>Pour tester n8n :</strong> Déployez sur votre serveur avec <code>docker-compose -f docker-compose.multi.yml up -d</code>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Accéder à n8n</CardTitle>
              <CardDescription>
                Plateforme d'automatisation de workflows pour connecter vos applications et automatiser vos processus métier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold mb-2">Fonctionnalités principales :</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Création de workflows visuels par glisser-déposer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Connexion avec plus de 200 applications et services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Automatisation de tâches répétitives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Webhooks et déclencheurs personnalisés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Exécution programmée et en temps réel</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1" disabled={!isProduction}>
                  <a href={n8nUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {isProduction ? "Ouvrir n8n" : "n8n non disponible en dev"}
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </Button>
              </div>

              {isProduction && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <strong>Note :</strong> Par défaut, n8n est protégé par une authentification basique.
                    Utilisez les identifiants configurés dans vos variables d'environnement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cas d'usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Synchronisation de données</h4>
                  <p className="text-sm text-muted-foreground">
                    Synchronisez automatiquement les données entre vos différentes applications et bases de données.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Notifications automatiques</h4>
                  <p className="text-sm text-muted-foreground">
                    Envoyez des notifications par email, Slack ou autres canaux selon des événements spécifiques.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Traitement de fichiers</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatisez le traitement, la conversion et le stockage de fichiers.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Intégrations API</h4>
                  <p className="text-sm text-muted-foreground">
                    Connectez et orchestrez plusieurs APIs pour créer des workflows complexes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default N8n;

