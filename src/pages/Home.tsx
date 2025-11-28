import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Activity, Brain, PenLine, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-6">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Bienvenue
            </h1>
            <p className="text-muted-foreground mt-1">
              Choisissez un outil pour continuer.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link to="/carte" className="group block">
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-xl bg-primary/10 text-primary p-3">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Carte Work&You</CardTitle>
                  <CardDescription>Visualisez agences et personnes par région.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Filtrage par ville, agence et département. Interface interactive.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/flux" className="group block">
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-xl bg-secondary/10 text-secondary p-3">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Check flux</CardTitle>
                  <CardDescription>Contrôlez les données entrantes/sortantes.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Suivi rapide de l’état des flux et vérifications clés.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/methode" className="group block">
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-xl bg-primary/10 text-primary p-3">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Méthode Work&You</CardTitle>
                  <CardDescription>Analyse de documents et rapports.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Déposez des PDF, lancez l’analyse, obtenez les livrables.
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/signatures" className="group block">
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-xl bg-secondary/10 text-secondary p-3">
                  <PenLine className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Signatures</CardTitle>
                  <CardDescription>Générez et gérez vos signatures.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Modèles prêts à l’emploi et personnalisation rapide.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;



