import { AlertCircle } from "lucide-react";

export const NicokaConfigInfo = () => {
  const isConfiguredWithToken = 
    import.meta.env.VITE_NICOKA_SUBDOMAIN && 
    import.meta.env.VITE_NICOKA_TOKEN;
    
  const isConfiguredWithLogin = 
    import.meta.env.VITE_NICOKA_SUBDOMAIN && 
    import.meta.env.VITE_NICOKA_LOGIN && 
    import.meta.env.VITE_NICOKA_PASSWORD;

  if (isConfiguredWithToken || isConfiguredWithLogin) return null;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 mb-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 mb-2">
            Configuration Nicoka ATS requise
          </h4>
          <p className="text-sm text-amber-800 mb-3">
            Pour utiliser l'import depuis Nicoka ATS, vous devez configurer vos identifiants
            dans le fichier <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code>
          </p>
          <div className="text-sm text-amber-800 space-y-3">
            <div>
              <p className="font-semibold mb-1">✅ Méthode recommandée : Jeton d'accès</p>
              <p className="text-xs mb-2">Générez un jeton depuis Nicoka (Administration → Utilisateur API → Afficher le jeton)</p>
              <pre className="bg-amber-900 text-amber-50 p-3 rounded overflow-x-auto text-xs">
{`VITE_NICOKA_SUBDOMAIN=workandyou
VITE_NICOKA_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGc...`}
              </pre>
            </div>
            
            <div>
              <p className="font-semibold mb-1">Alternative : Login/Password</p>
              <pre className="bg-amber-900 text-amber-50 p-3 rounded overflow-x-auto text-xs">
{`VITE_NICOKA_SUBDOMAIN=workandyou
VITE_NICOKA_LOGIN=api@workandyou.fr
VITE_NICOKA_PASSWORD=votre-mot-de-passe`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

