import { useQuery } from "@tanstack/react-query";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

const FLUX_KEYS = ["hellowork", "directemploi", "meteojob", "indeed"] as const;
type FluxKey = typeof FLUX_KEYS[number];

type FluxCounts = Record<FluxKey, number> & {
  errors?: Record<string, string>;
  fetchedAt?: string;
};

const Flux = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fluxCounts"],
    queryFn: async (): Promise<FluxCounts> => {
      const response = await fetch("/api/flux-counts", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Impossible de récupérer les flux");
      }
      return response.json();
    },
    refetchInterval: SIX_HOURS_MS,
    refetchIntervalInBackground: true,
    staleTime: SIX_HOURS_MS,
  });

  const counts: Record<FluxKey, number> = {
    hellowork: data?.hellowork ?? 0,
    directemploi: data?.directemploi ?? 0,
    meteojob: data?.meteojob ?? 0,
    indeed: data?.indeed ?? 0,
  };

  const fluxList: Array<{ key: FluxKey; label: string }> = [
    { key: "hellowork", label: "Hellowork" },
    { key: "directemploi", label: "Directemploi" },
    { key: "meteojob", label: "Météojob" },
    { key: "indeed", label: "Indeed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <main className="container mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Liste des flux :</h1>
        {isError ? (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-destructive">
            <p>Erreur lors de la récupération des flux.</p>
            {error instanceof Error && <p className="text-sm mt-2">{error.message}</p>}
          </div>
        ) : (
          <div className="text-lg space-y-2">
            {fluxList.map(({ key, label }) => {
              if (isLoading) {
                return (
                  <p key={key} className="text-muted-foreground">
                    {label} : chargement…
                  </p>
                );
              }
              if (data?.errors && data.errors[key]) {
                return (
                  <p key={key} className="text-destructive">
                    {label} : erreur de lecture
                  </p>
                );
              }
              return (
                <p key={key}>
                  {label} : {counts[key]}
                </p>
              );
            })}
            {data?.fetchedAt && (
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour : {new Date(data.fetchedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Flux;


