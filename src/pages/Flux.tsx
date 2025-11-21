import { useQuery } from "@tanstack/react-query";

const HELLOWORK_FLUX_URL = "https://master.nicoka.com/jobboards/hellowork/workandyou.xml";
const HELLOWORK_DEV_PROXY_URL = "/proxy/hellowork/workandyou.xml";

const DIRECTEMPLOI_FLUX_URL = "https://master.nicoka.com/jobboards/directemploi/workandyou.xml";
const DIRECTEMPLOI_DEV_PROXY_URL = "/proxy/directemploi/workandyou.xml";

const METEOJOB_FLUX_URL = "https://master.nicoka.com/jobboards/meteojob/workandyou.xml";
const METEOJOB_DEV_PROXY_URL = "/proxy/meteojob/workandyou.xml";

const INDEED_FLUX_URL = "https://master.nicoka.com/jobboards/indeed/workandyou.xml";
const INDEED_DEV_PROXY_URL = "/proxy/indeed/workandyou.xml";
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

function countOffersFromXml(xmlText: string): number {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    // Si le XML contient des erreurs, le parser crée une balise <parsererror>
    if (xmlDoc.querySelector("parsererror")) {
      return 0;
    }
    return xmlDoc.getElementsByTagName("offre").length;
  } catch {
    return 0;
  }
}

async function fetchXmlTextWithFallbacks(url: string, devProxyUrl?: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`;
  const attempts = [
    ...(devProxyUrl ? [devProxyUrl] : []),
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    jinaUrl,
  ] as const;
  let lastError: unknown = null;
  for (const attemptUrl of attempts) {
    try {
      const response = await fetch(attemptUrl, { cache: "no-cache" });
      if (response.ok) {
        return await response.text();
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to fetch XML");
}

const Flux = () => {
  const { data: helloworkOfferCount, isLoading: isHwLoading, isError: isHwError } = useQuery({
    queryKey: ["helloworkFluxCount"],
    queryFn: async (): Promise<number> => {
      const xmlText = await fetchXmlTextWithFallbacks(HELLOWORK_FLUX_URL, HELLOWORK_DEV_PROXY_URL);
      return countOffersFromXml(xmlText);
    },
    // Rafraîchit automatiquement toutes les 6 heures
    refetchInterval: SIX_HOURS_MS,
    refetchIntervalInBackground: true,
    // Un flux d'offres n'a pas besoin d'être recalculé côté client, on peut le considérer frais longtemps
    staleTime: SIX_HOURS_MS,
  });

  const { data: directemploiCount, isLoading: isDeLoading, isError: isDeError } = useQuery({
    queryKey: ["directemploiFluxCount"],
    queryFn: async (): Promise<number> => {
      const xmlText = await fetchXmlTextWithFallbacks(DIRECTEMPLOI_FLUX_URL, DIRECTEMPLOI_DEV_PROXY_URL);
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        if (xmlDoc.querySelector("parsererror")) {
          return 0;
        }
        return xmlDoc.getElementsByTagName("job").length;
      } catch {
        return 0;
      }
    },
    refetchInterval: SIX_HOURS_MS,
    refetchIntervalInBackground: true,
    staleTime: SIX_HOURS_MS,
  });

  const { data: meteojobCount, isLoading: isMjLoading, isError: isMjError } = useQuery({
    queryKey: ["meteojobFluxCount"],
    queryFn: async (): Promise<number> => {
      const xmlText = await fetchXmlTextWithFallbacks(METEOJOB_FLUX_URL, METEOJOB_DEV_PROXY_URL);
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        if (xmlDoc.querySelector("parsererror")) {
          return 0;
        }
        return xmlDoc.getElementsByTagName("position").length;
      } catch {
        return 0;
      }
    },
    refetchInterval: SIX_HOURS_MS,
    refetchIntervalInBackground: true,
    staleTime: SIX_HOURS_MS,
  });

  const { data: indeedCount, isLoading: isIdLoading, isError: isIdError } = useQuery({
    queryKey: ["indeedFluxCount"],
    queryFn: async (): Promise<number> => {
      const xmlText = await fetchXmlTextWithFallbacks(INDEED_FLUX_URL, INDEED_DEV_PROXY_URL);
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        if (xmlDoc.querySelector("parsererror")) {
          return 0;
        }
        return xmlDoc.getElementsByTagName("job").length;
      } catch {
        return 0;
      }
    },
    refetchInterval: SIX_HOURS_MS,
    refetchIntervalInBackground: true,
    staleTime: SIX_HOURS_MS,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <main className="container mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Liste des flux :</h1>
        <div className="text-lg space-y-2">
          {isHwLoading ? (
            <p className="text-muted-foreground">Hellowork : chargement…</p>
          ) : isHwError ? (
            <p className="text-destructive">Hellowork : erreur de lecture</p>
          ) : (
            <p>Hellowork : {helloworkOfferCount ?? 0}</p>
          )}
          {isDeLoading ? (
            <p className="text-muted-foreground">Directemploi : chargement…</p>
          ) : isDeError ? (
            <p className="text-destructive">Directemploi : erreur de lecture</p>
          ) : (
            <p>Directemploi : {directemploiCount ?? 0}</p>
          )}
          {isMjLoading ? (
            <p className="text-muted-foreground">Météojob : chargement…</p>
          ) : isMjError ? (
            <p className="text-destructive">Météojob : erreur de lecture</p>
          ) : (
            <p>Météojob : {meteojobCount ?? 0}</p>
          )}
          {isIdLoading ? (
            <p className="text-muted-foreground">Indeed : chargement…</p>
          ) : isIdError ? (
            <p className="text-destructive">Indeed : erreur de lecture</p>
          ) : (
            <p>Indeed : {indeedCount ?? 0}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Flux;


