const Signatures = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="p-6 space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Signatures email
        </h1>
        <p className="text-muted-foreground">
          L’outil est intégré au projet. Connectez-vous si demandé, puis générez votre signature.
        </p>
      </header>
      <main className="container mx-auto px-4 pb-8">
        <div className="rounded-lg overflow-hidden border bg-background">
          <iframe
            title="Signatures"
            src="/signatures/index.html"
            className="w-full"
            style={{ height: "80vh" }}
          />
        </div>
      </main>
    </div>
  );
};

export default Signatures;


