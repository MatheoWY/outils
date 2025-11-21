import { useRef, useState, useEffect, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileText, User2, Brain, Mic, X, Copy, Download } from "lucide-react";

declare global {
  interface Window {
    jspdf?: any;
    html2canvas?: any;
  }
}

const MethodeWorkAndYou = () => {
  const DEFAULT_PROMPT = `🎯 Objectif global
À partir des quatre documents suivants :

1. L’offre d’emploi
2. Le CV du candidat
3. La transcription d’entretien
4. Le rapport de personnalité (Talentobe / MyPrint®)
Produire quatre livrables :
5. 🧾 Rapport de matching brut interne (non diffusé)
6. 📄 Rapport Client
7. 🧠 Rapport Consultant
8. 💬 Rapport Candidat

🔹 Phase 1 – Analyse du poste
Analyser automatiquement l’offre d’emploi pour identifier :

- Les compétences techniques attendues
- Les expériences clés souhaitées
- Le niveau de formation requis
- Les contraintes géographiques
- Les soft skills implicites (autonomie, rigueur, esprit d’équipe, etc.)
Déduire ensuite 4 à 6 traits de personnalité clés à succès selon la terminologie Talentobe (ex. : Ambition, Patience, Dominance, Structure, Résilience…).
Générer un profil-cible préliminaire, avant validation par le consultant.

🔹 Phase 2 – Calibration interactive (nouveauté essentielle)
Avant de calculer le score de matching, le modèle engage un échange de questions-réponses structuré avec le consultant Work&You pour affiner les critères.
⚙️ Objectif :

- S’assurer de bien comprendre le niveau d’exigence technique et comportementale du poste
- Définir la sélectivité du recrutement
- Adapter les pondérations et l’échelle de tolérance.

🗂️ Exemple de questions types

1. Positionnement du poste
Quel est le niveau de spécialisation attendu ?
- A : Spécialiste technique (expert métier / ingénierie pure)
- B : Chef de projet généraliste avec compréhension technique
- C : Responsable d’affaires orienté gestion et pilotage
2: Formation Métier
Est-ce que la formation métier doit être en lien avec les compétences attendue ?
(exemple: formation d'ingénieur en électricité pour un poste de responsable d'affaires en électricité)
1. Formation académique attendue
Quelle formation minimale est requise pour être crédible sur le poste ?
(ex. : BTS, DUT, Ingénieur, Licence Pro, Master, etc.)
2. Priorités de compétences
Souhaitez-vous que la pondération des compétences techniques porte sur :
- la spécialisation métier pure (ex. : CFO/CFA, comptabilité, codage, etc.)
- ou la polyvalence / coordination multi-domaines ?

🧩 Ces réponses ajustent automatiquement :

- Les scores de chaque critère technique 40 %, formation 15 %, expérience 25 %, personnalité 15 %, motivation 5 %)

🔹 Phase 3 – Calcul du Matching
Le modèle attribue une note sur 100 % à chaque critère, puis calcule le score global selon la formule mécanique :
Score global = Σ (note × pondération / 100)
Un tableau de pondération détaillé est affiché dans le rapport brut, avec commentaires factuels pour chaque critère.

🧾 Exemple de structure du rapport brut :
Critère	Pondération	Score	Points pondérés	Commentaire
Compétences techniques	40 %	62 %	24,8 pts	Détails et contexte
Expérience métier	25 %	68 %	17 pts	Détails et contexte
Formation	15 %	50 %	7,5 pts	Détails et contexte
Personnalité	15 %	75 %	11,25 pts	Détails et contexte
Motivation	5 %	70 %	3,5 pts	Détails et contexte
Total	100 %		64,05 %	Matching moyen
🔹 Phase 4 – Génération des 3 rapports finalisés
Une fois le rapport brut validé par le consultant :

1. Rapport Client
    - Score global + synthèse + tableau couleur (🟢🟠🔴)
    - Détails personnalité (5–6 traits clés)
    - Points de vigilance et conclusion engageante
2. Rapport Consultant
    - Forces / faiblesses
    - Recommandations concrètes
    - Citations issues de la transcription
    - Pistes de questionnement
3. Rapport Candidat
    - Points forts valorisés
    - Axes de progression
    - Conseils personnalisés
    - Ton bienveillant et motivationnel

🧠 Règles générales

- Le ton du rapport brut = factuel, analytique et professionnel
- Les scores sont calculés mécaniquement, jamais arrondis arbitrairement
- Le modèle ne surévalue pas les profils : il applique le principe du “fit réaliste”, pas du “fit positif”
- Les 4 livrables doivent être cohérents entre eux (même trame narrative adaptée à la cible)`;

  const [prompt] = useState(DEFAULT_PROMPT);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [rawReport, setRawReport] = useState<string>("");
  const [clientReport, setClientReport] = useState<string>("");
  const [consultantReport, setConsultantReport] = useState<string>("");
  const [candidateReport, setCandidateReport] = useState<string>("");
  const [showReports, setShowReports] = useState<boolean>(false);
  const [editRaw, setEditRaw] = useState<boolean>(false);
  const [editClient, setEditClient] = useState<boolean>(false);
  const [editConsultant, setEditConsultant] = useState<boolean>(false);
  const [editCandidate, setEditCandidate] = useState<boolean>(false);
  const rawRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<HTMLDivElement | null>(null);
  const consultantRef = useRef<HTMLDivElement | null>(null);
  const candidateRef = useRef<HTMLDivElement | null>(null);

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existing) {
        existing.onload = () => resolve();
        return resolve();
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Impossible de charger ${src}`));
      document.body.appendChild(script);
    });

  const ensureJsPdfLoaded = async () => {
    if (!window.jspdf) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    }
    if (!window.html2canvas) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
    }
  };

  const handleCopy = async (text: string, elementId?: string) => {
    try {
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          await navigator.clipboard.writeText(el.innerText || "");
        } else {
          await navigator.clipboard.writeText(text);
        }
      } else {
        await navigator.clipboard.writeText(text);
      }
      setResult("Texte copié dans le presse-papiers.");
    } catch {
      setError("Impossible de copier le texte.");
    }
  };

  const handleDownloadPdf = async (content: string, filename: string) => {
    try {
      await ensureJsPdfLoaded();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      const lines = doc.splitTextToSize(content || "", maxWidth);
      let y = margin;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      for (let i = 0; i < lines.length; i++) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(lines[i], margin, y);
        y += 16;
      }
      doc.save(`${filename}.pdf`);
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la génération du PDF.");
    }
  };

  const handleDownloadPdfFromHtml = async (elementId: string, filename: string) => {
    try {
      await ensureJsPdfLoaded();
      const el = document.getElementById(elementId);
      if (!el) throw new Error("Contenu introuvable");
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      // Utilise le rendu HTML pour conserver tableaux et listes
      await doc.html(el, {
        x: 24,
        y: 24,
        width: 547, // ~ A4 width - margins
        windowWidth: el.scrollWidth || 800,
      });
      doc.save(`${filename}.pdf`);
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la génération du PDF (HTML).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    try {
      // Simulation locale de 4 rapports (HTML avec tableaux)
      const tableStyle = "width:100%;border-collapse:collapse;margin:12px 0;";
      const thStyle = "border:1px solid #cbd5e1;padding:8px;background:#f1f5f9;color:#0f172a;text-align:left;";
      const tdStyle = "border:1px solid #cbd5e1;padding:8px;vertical-align:top;color:#0f172a;";

      const demoRaw =
`<div>
  <h4 style="margin:0 0 8px 0;">1️⃣ Rapport de matching brut interne (non diffusé)</h4>
  <p style="margin:0 0 12px 0;color:#cbd5e1;">(utilisé uniquement pour l’évaluation interne – non partagé avec le client ou le candidat)</p>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Critère</th>
        <th style="${thStyle}">Pondération</th>
        <th style="${thStyle}">Score attribué</th>
        <th style="${thStyle}">Points pondérés</th>
        <th style="${thStyle}">Commentaire factuel</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="${tdStyle}">Compétences techniques (électricité tertiaire, gestion de chantier)</td>
        <td style="${tdStyle}">40 %</td>
        <td style="${tdStyle}">70 %</td>
        <td style="${tdStyle}">28,0 pts</td>
        <td style="${tdStyle}">Expérience démontrée sur des projets SATELEC et rénovation immobilière (Citation 8). Connaissances pratiques en maîtrise d’ouvrage et résolution de problèmes techniques.</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Expérience professionnelle</td>
        <td style="${tdStyle}">25 %</td>
        <td style="${tdStyle}">90 %</td>
        <td style="${tdStyle}">22,5 pts</td>
        <td style="${tdStyle}">Plus de 10 ans d’expérience dans le secteur, gestion de chantiers divers (Citation 8) et capacité à piloter des équipes techniques.</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Niveau de formation</td>
        <td style="${tdStyle}">15 %</td>
        <td style="${tdStyle}">80 %</td>
        <td style="${tdStyle}">12,0 pts</td>
        <td style="${tdStyle}">Formation probable en ingénierie électrique ou équivalent (non précisé explicitement mais cohérente avec le parcours professionnel).</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Personnalité (adaptation aux exigences du poste)</td>
        <td style="${tdStyle}">15 %</td>
        <td style="${tdStyle}">80 %</td>
        <td style="${tdStyle}">12,0 pts</td>
        <td style="${tdStyle}">Traits clés : structure élevée (69 % ordonné), persévérance déterminée (63 % déterminé), autonomie et sens de la responsabilité (Citation 4‑6).</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Motivation & adéquation culturelle</td>
        <td style="${tdStyle}">5 %</td>
        <td style="${tdStyle}">75 %</td>
        <td style="${tdStyle}">3,8 pts</td>
        <td style="${tdStyle}">Motivations alignées sur la gestion d’envergure, le challenge et l’innovation (Citation 6‑7).</td>
      </tr>
    </tbody>
  </table>
  <p style="margin:8px 0;"><strong>Score global :</strong> 78 % (score pondéré = 78,25 %)</p>
  <p style="margin:8px 0;">Indication de correspondance très favorable. Le candidat dépasse largement les exigences minimales.</p>
</div>`;

      const demoClient =
`<div>
  <h4 style="margin:0 0 8px 0;">Rapport Client</h4>
  <h5 style="margin:12px 0 6px 0;">Note d’Analyse Confidentielle – Candidature de Alexandre Nomdedeu</h5>

  <h5 style="margin:12px 0 6px 0;">Appréciation globale</h5>
  <p style="margin:0 0 12px 0;">
    Adéquation très forte avec les exigences du poste. Le profil combine une expérience robuste,
    des compétences techniques pertinentes et un tempérament aligné aux valeurs de l’entreprise.
  </p>

  <h5 style="margin:12px 0 6px 0;">Synthèse des Points Forts</h5>
  <p style="margin:0 0 12px 0;">
    Alexandre possède plus d’une décennie de gestion de projets d’envergure, notamment dans le retail,
    l’hôtellerie et le tertiaire. Il a dirigé des équipes pluridisciplinaires, maîtrisé les budgets
    allant jusqu’à neuf millions d’euros, et démontré une capacité à naviguer entre client, maître d’œuvre
    et prestataires. Sa connaissance pratique de la maîtrise d’œuvre et de la maîtrise d’ouvrage lui
    permet de comprendre rapidement les attentes de chaque partie prenante.
  </p>

  <h5 style="margin:12px 0 6px 0;">Analyse Comportementale (Fit Culturel)</h5>
  <p style="margin:0 0 12px 0;">
    Son profil structurel et organisé favorise le respect des procédures de sécurité et de qualité. La forte
    envie de responsabilité l’incite à prendre les rênes des projets, tandis que son approche visionnaire
    stimule la recherche d’innovations adaptées aux contraintes réglementaires. Son style diplomatique facilite
    la négociation avec les parties prenantes tout en maintenant un climat de collaboration.
  </p>

  <h5 style="margin:12px 0 6px 0;">Axes de Vigilance (Points à approfondir)</h5>
  <ul style="margin:0 0 12px 18px;">
    <li>Vérifier sa capacité à s’adapter aux spécificités des installations électriques tertiaires, où il a moins d’expérience directe.</li>
    <li>Évaluer son aisance dans la gestion de projets très réglementés, notamment les normes spécifiques au secteur public.</li>
    <li>Confirmer que sa propension à prendre des risques n’entraîne pas de dépassements budgétaires ou de non‑conformité aux exigences de sécurité.</li>
  </ul>

  <h5 style="margin:12px 0 6px 0;">Recommandation</h5>
  <p style="margin:0 0 12px 0;">
    Nous vous recommandons vivement d’organiser un entretien approfondi avec Alexandre afin de valider ces points
    et de mesurer son potentiel d’intégration dans la culture de votre organisation. Sa candidature mérite une
    place de choix dans le processus de sélection.
  </p>
</div>`;

      const demoConsultant =
`<div>
  <h4 style="margin:0 0 8px 0;">Rapport Consultant</h4>
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th style="${thStyle}">Critère</th>
        <th style="${thStyle}">Pondération</th>
        <th style="${thStyle}">Score (0‑100)</th>
        <th style="${thStyle}">Points pondérés</th>
        <th style="${thStyle}">Commentaire</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="${tdStyle}">Compétences techniques</td>
        <td style="${tdStyle}">40 %</td>
        <td style="${tdStyle}">90</td>
        <td style="${tdStyle}">36,0</td>
        <td style="${tdStyle}">Expertise technique solide ; lacune sur la spécialité tertiaire.</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Expérience métier</td>
        <td style="${tdStyle}">25 %</td>
        <td style="${tdStyle}">85</td>
        <td style="${tdStyle}">21,3</td>
        <td style="${tdStyle}">Plus de dix ans d’expérience, budgets élevés.</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Formation académique</td>
        <td style="${tdStyle}">15 %</td>
        <td style="${tdStyle}">70</td>
        <td style="${tdStyle}">10,5</td>
        <td style="${tdStyle}">Pas diplômé ingénieur ; compensé par expérience terrain.</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Personnalité</td>
        <td style="${tdStyle}">15 %</td>
        <td style="${tdStyle}">80</td>
        <td style="${tdStyle}">12,0</td>
        <td style="${tdStyle}">Traits alignés (structure, responsabilité, innovation).</td>
      </tr>
      <tr>
        <td style="${tdStyle}">Motivation</td>
        <td style="${tdStyle}">5 %</td>
        <td style="${tdStyle}">75</td>
        <td style="${tdStyle}">3,8</td>
        <td style="${tdStyle}">Motivé par responsabilités et apprentissage continu.</td>
      </tr>
    </tbody>
  </table>
  <p style="margin:8px 0;"><strong>Score global pondéré :</strong> 83,6 % – Très bon fit</p>

  <h5 style="margin:12px 0 6px 0;">Analyse SWOT</h5>
  <p><strong>Forces :</strong> Expérience large, compétences en gestion de projets, personnalité structurée et responsable, créativité.</p>
  <p><strong>Faiblesses :</strong> Manque d’expérience directe en installations tertiaires spécifiques, formation académique non conforme aux attentes.</p>
  <p><strong>Opportunités :</strong> Possibilité de former rapidement sur les normes tertiaires, potentiel de leadership à long terme.</p>
  <p><strong>Menaces :</strong> Risque de dépassement budgétaire si la prise de risque n’est pas maîtrisée.</p>

  <h5 style="margin:12px 0 6px 0;">Citations clés (transcription d’entretien)</h5>
  <ul style="margin:0 0 8px 18px;">
    <li>« Je me sens responsable du travail d’un grand nombre de personnes et je souhaite être impliqué dans des projets où beaucoup de choses dépendent de moi ».</li>
    <li>« J’aime apprendre régulièrement de nouvelles connaissances ou compétences, changer fréquemment de projets ».</li>
  </ul>

  <h5 style="margin:12px 0 6px 0;">Pistes de questionnement pour l’entretien suivant</h5>
  <ul style="margin:0 0 8px 18px;">
    <li>Pouvez‑vous détailler un projet tertiaire où vous avez dû appliquer les normes spécifiques à ce secteur ?</li>
    <li>Comment gérez‑vous le risque d’un dépassement budgétaire lorsque vous prenez des décisions audacieuses ?</li>
    <li>Dans quelle mesure vous sentez‑vous à l’aise de travailler dans un environnement très réglementé et prévisible ?</li>
  </ul>
</div>`;

      const demoCandidate =
`<div>
  <h4 style="margin:0 0 8px 0;">Rapport Candidat</h4>
  <p style="margin:0 0 12px 0;">Bonjour Alexandre,</p>
  <p style="margin:0 0 12px 0;">
    Nous avons examiné votre candidature pour le poste de Responsable travaux électricité tertiaire. Vous avez démontré
    une expérience solide en gestion de projets d’envergure (budget jusqu’à 9 M€) ainsi qu’une capacité à diriger des
    équipes pluridisciplinaires. Votre profil structurel et votre sens de la responsabilité vous permettront de garantir
    qualité, sécurité et respect des délais.
  </p>
  <h5 style="margin:12px 0 6px 0;">Points forts à mettre en avant lors de votre prochain entretien</h5>
  <ul style="margin:0 0 12px 18px;">
    <li><strong>Expérience terrain :</strong> Soulignez les projets où vous avez piloté l’ensemble du cycle de vie (appel d’offres, suivi chantier, réception).</li>
    <li><strong>Leadership :</strong> Mettez en lumière vos réussites dans la coordination d’équipes techniques et administratives.</li>
    <li><strong>Innovation :</strong> Donnez un exemple concret où votre approche visionnaire a conduit à une amélioration notable.</li>
  </ul>
  <h5 style="margin:12px 0 6px 0;">Opportunités de développement</h5>
  <ul style="margin:0 0 12px 18px;">
    <li><strong>Spécialisation tertiaire :</strong> Enrichissez votre connaissance des normes électriques spécifiques aux bâtiments tertiaires (ex. RGE, NF C 15‑100).</li>
    <li><strong>Gestion du risque budgétaire :</strong> Mettez en place des indicateurs de suivi pour anticiper les dépassements et ajuster rapidement le plan d’action.</li>
  </ul>
  <h5 style="margin:12px 0 6px 0;">Conseils pratiques pour votre entretien</h5>
  <ol style="margin:0 0 12px 18px;">
    <li>Préparez un cas concret où vous avez géré un projet complexe, en détaillant vos décisions clés, les risques identifiés et les résultats obtenus.</li>
    <li>Montrez comment votre approche créative a été bénéfique sans compromettre la sécurité ou la conformité réglementaire.</li>
    <li>Soyez prêt à expliquer comment vous adaptez votre style de gestion aux exigences d’un environnement très structuré.</li>
  </ol>
  <p style="margin:0 0 12px 0;">
    Nous sommes convaincus que votre profil correspond bien aux attentes du poste et nous vous souhaitons plein succès
    pour les prochaines étapes.
  </p>
</div>`;

      setRawReport(demoRaw);
      setClientReport(demoClient);
      setConsultantReport(demoConsultant);
      setCandidateReport(demoCandidate);
      setShowReports(true);
      setResult("Rapports générés (simulation locale).");
    } catch (err: any) {
      setError(err?.message || "Erreur pendant l'analyse");
    } finally {
      setLoading(false);
    }
  };

  // Gère les URLs locales de prévisualisation
  useEffect(() => {
    const urls = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u.url));
    };
  }, [files]);

  const getFileKey = (f: File) => `${f.name}::${f.size}::${f.lastModified}`;

  const addFiles = (incoming: File[]) => {
    const pdfs = incoming.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length !== incoming.length) {
      setError("Seuls les fichiers PDF sont acceptés.");
    }
    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => getFileKey(f)));
      const merged = [...prev];
      pdfs.forEach((f) => {
        const key = getFileKey(f);
        if (!existingKeys.has(key)) {
          merged.push(f);
          existingKeys.add(key);
        }
      });
      return merged;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dtFiles = Array.from(e.dataTransfer.files || []);
    if (dtFiles.length) addFiles(dtFiles);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeFileAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAll = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="p-6">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Méthode Work&amp;You — Analyse de documents
            </h1>
            <p className="text-muted-foreground mt-1">
              Téléversez des PDF (CV, offres, etc.). Un prompt standard est utilisé automatiquement.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-4xl">
        {/* Styles dédiés aux aperçus de rapports */}
        <style>{`
          .report-preview {
            background: #ffffff;
            color: #0f172a;
          }
          .report-preview h4 {
            font-weight: 700;
            font-size: 1.125rem;
            margin: 0 0 8px 0;
          }
          .report-preview h5 {
            font-weight: 700;
            font-size: 1rem;
            margin: 12px 0 6px 0;
          }
          .report-preview p,
          .report-preview li {
            line-height: 1.6;
          }
          .report-preview ul,
          .report-preview ol {
            padding-left: 1.25rem;
          }
          .report-preview table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
          }
          .report-preview th {
            border: 1px solid #cbd5e1;
            padding: 8px;
            background: #f8fafc;
            color: #0f172a;
            text-align: left;
            font-weight: 700;
          }
          .report-preview td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            vertical-align: top;
            color: #0f172a;
          }
          .report-preview strong {
            font-weight: 700;
          }
        `}</style>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Grande zone de glisser-déposer */}
          <section
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`rounded-xl border-2 border-dashed p-8 text-center bg-card transition-all duration-300 ${
              isDragging
                ? "border-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.08)]"
                : "border-muted-foreground/30 hover:bg-muted/30"
            }`}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            aria-label="Zone de dépôt de fichiers PDF"
          >
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className={`w-10 h-10 text-primary transition-transform ${isDragging ? "animate-float" : ""}`} />
              <p className="text-lg font-semibold">Glissez & déposez vos PDF ici</p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour parcourir. Formats acceptés: PDF. Taille max: 20 Mo par fichier.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-secondary/20 transition-transform hover:scale-[1.03]">
                  <FileText className="w-3.5 h-3.5" /> L’offre d’emploi
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-secondary/20 transition-transform hover:scale-[1.03]">
                  <User2 className="w-3.5 h-3.5" /> CV du candidat
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-secondary/20 transition-transform hover:scale-[1.03]">
                  <Mic className="w-3.5 h-3.5" /> Transcription d’entretien
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-secondary/20 transition-transform hover:scale-[1.03]">
                  <Brain className="w-3.5 h-3.5" /> Rapport de personnalité
                </span>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(Array.from(e.target.files || []));
                // Reset explicite pour que la sélection des mêmes fichiers re-déclenche l'évènement
                e.currentTarget.value = "";
              }}
            />
          </section>

          {/* Liste des fichiers sélectionnés */}
          {files.length > 0 && (
            <section className="rounded-md border bg-card/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Fichiers sélectionnés ({files.length})</p>
                <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                  Vider la sélection
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((f, idx) => {
                  const url = previews[idx]?.url;
                  return (
                    <div className="rounded-md border bg-background p-3 space-y-2 transition-all hover:shadow-md hover:-translate-y-0.5" key={`${f.name}-${idx}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium truncate">{f.name}</span>
                        <div className="flex items-center gap-2">
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ouvrir
                            </a>
                          )}
                          <button
                            type="button"
                            aria-label={`Retirer ${f.name}`}
                            className="inline-flex items-center justify-center rounded border px-2 py-1 text-xs hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFileAt(idx);
                            }}
                          >
                            <X className="w-3.5 h-3.5 mr-1" /> Retirer
                          </button>
                        </div>
                      </div>
                      {url && (
                        <iframe
                          src={url}
                          title={`preview-${idx}`}
                          className="w-full h-64 rounded border bg-white"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bouton d'action */}
          <div className="flex items-center gap-3">
            <Button type="submit" size="lg" disabled={loading || files.length === 0} className="transition-transform hover:scale-[1.01] active:scale-[0.99]">
              {loading ? "Analyse en cours…" : "Lancer l'analyse"}
            </Button>
            {loading && (
              <span className="text-sm text-muted-foreground">Cela peut prendre 1 à 2 minutes…</span>
            )}
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
        </form>

        {/* Résultat */}
        <section className="rounded-lg border bg-card text-card-foreground p-6 space-y-4 mt-8 animate-fade-in-up">
          <h2 className="text-xl font-semibold">Résultat</h2>
          <div className="min-h-[160px] rounded-md bg-background/60 border p-4 whitespace-pre-wrap" aria-live="polite">
            {loading ? "🔄 Analyse en cours…" : (result || "Aucun résultat pour le moment.")}
          </div>
        </section>

        {showReports && (
          <section className="rounded-lg border bg-card text-card-foreground p-6 space-y-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold">🧾 Rapport brut (interne)</h3>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(rawReport, "rawReportPreview")}>
                  <Copy className="w-4 h-4 mr-2" /> Copier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadPdfFromHtml("rawReportPreview", "Rapport_brut")}>
                  <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editRaw && rawRef.current) setRawReport(rawRef.current.innerHTML);
                    setEditRaw(!editRaw);
                  }}
                >
                  {editRaw ? "Enregistrer" : "Modifier"}
                </Button>
              </div>
              <div
                id="rawReportPreview"
                ref={rawRef}
                className={`mt-3 w-full rounded border p-4 text-sm overflow-x-auto ${editRaw ? "ring-2 ring-primary" : ""}`}
                style={{ background: "#ffffff", color: "#0f172a" }}
                contentEditable={editRaw}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: rawReport }}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">📄 Rapport Client</h3>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(clientReport, "clientReportPreview")}>
                  <Copy className="w-4 h-4 mr-2" /> Copier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadPdfFromHtml("clientReportPreview", "Rapport_Client")}>
                  <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editClient && clientRef.current) setClientReport(clientRef.current.innerHTML);
                    setEditClient(!editClient);
                  }}
                >
                  {editClient ? "Enregistrer" : "Modifier"}
                </Button>
              </div>
              <div
                id="clientReportPreview"
                ref={clientRef}
                className={`mt-3 w-full rounded border p-4 text-sm overflow-x-auto ${editClient ? "ring-2 ring-primary" : ""}`}
                style={{ background: "#ffffff", color: "#0f172a" }}
                contentEditable={editClient}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: clientReport }}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">🧠 Rapport Consultant</h3>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(consultantReport, "consultantReportPreview")}>
                  <Copy className="w-4 h-4 mr-2" /> Copier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadPdfFromHtml("consultantReportPreview", "Rapport_Consultant")}>
                  <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editConsultant && consultantRef.current) setConsultantReport(consultantRef.current.innerHTML);
                    setEditConsultant(!editConsultant);
                  }}
                >
                  {editConsultant ? "Enregistrer" : "Modifier"}
                </Button>
              </div>
              <div
                id="consultantReportPreview"
                ref={consultantRef}
                className={`mt-3 w-full rounded border p-4 text-sm overflow-x-auto ${editConsultant ? "ring-2 ring-primary" : ""}`}
                style={{ background: "#ffffff", color: "#0f172a" }}
                contentEditable={editConsultant}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: consultantReport }}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">💬 Rapport Candidat</h3>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(candidateReport, "candidateReportPreview")}>
                  <Copy className="w-4 h-4 mr-2" /> Copier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadPdfFromHtml("candidateReportPreview", "Rapport_Candidat")}>
                  <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editCandidate && candidateRef.current) setCandidateReport(candidateRef.current.innerHTML);
                    setEditCandidate(!editCandidate);
                  }}
                >
                  {editCandidate ? "Enregistrer" : "Modifier"}
                </Button>
              </div>
              <div
                id="candidateReportPreview"
                ref={candidateRef}
                className={`mt-3 w-full rounded border p-4 text-sm overflow-x-auto ${editCandidate ? "ring-2 ring-primary" : ""}`}
                style={{ background: "#ffffff", color: "#0f172a" }}
                contentEditable={editCandidate}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: candidateReport }}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MethodeWorkAndYou;
