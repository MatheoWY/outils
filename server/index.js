import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { fileURLToPath } from "url";

// Petite utilitaire d'attente
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");

// Charge .env puis .env.local pour partager la config client/serveur
[".env", ".env.local"].forEach((filename) => {
  const envPath = path.join(appRoot, filename);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
});
const distDir = path.join(appRoot, "dist");
const publicSignaturesDir = path.join(appRoot, "public", "signatures");

const app = express();

// Configuration via env
const GITHUB_PAT = process.env.GITHUB_PAT || process.env.VITE_GITHUB_PAT || "";
const REPO_OWNER = process.env.REPO_OWNER || "MatheoWY";
const REPO_NAME = process.env.REPO_NAME || "signatures";
const BRANCH = process.env.BRANCH || "main";
const PORT = Number(process.env.PORT || (process.env.NODE_ENV === "production" ? 80 : 5174));
const WORKANDYOU_API_URL = process.env.WORKANDYOU_API_URL || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const ALLOWED_DOMAIN = (process.env.ALLOWED_DOMAIN || "workandyou.fr").toLowerCase();
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`;
// Auth activée en production si les identifiants Google sont configurés
const AUTH_ENABLED = 
  process.env.NODE_ENV === "production" && 
  GOOGLE_CLIENT_ID && 
  GOOGLE_CLIENT_SECRET && 
  SESSION_SECRET;

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  String(header).split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx > -1) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, repo: `${REPO_OWNER}/${REPO_NAME}`, branch: BRANCH });
});

// --- Auth Google SSO (Passport) ---
// En dev, on rend l'auth optionnelle. Si les secrets sont absents, on bypass.
if (!SESSION_SECRET) {
  // eslint-disable-next-line no-console
  console.warn("SESSION_SECRET non défini. Définissez-le en production.");
}

app.set("trust proxy", 1); // si derrière un proxy (nginx)

app.use(
  session({
    secret: SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    },
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

if (!AUTH_ENABLED) {
  // eslint-disable-next-line no-console
  console.warn(
    `⚠️  AUTH DÉSACTIVÉE - Mode: ${process.env.NODE_ENV || "development"}`
  );
  // eslint-disable-next-line no-console
  console.warn(
    "   En production, configurez GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET et SESSION_SECRET"
  );
} else {
  // eslint-disable-next-line no-console
  console.log(`🔒 AUTH ACTIVÉE - Domaine autorisé: ${ALLOWED_DOMAIN}`);
  // eslint-disable-next-line no-console
  console.log(`   Callback URL: ${GOOGLE_CALLBACK_URL}`);
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            (Array.isArray(profile.emails) && profile.emails[0] && profile.emails[0].value) || "";
          const domain = email.split("@")[1]?.toLowerCase() || "";
          if (!email || domain !== ALLOWED_DOMAIN) {
            return done(null, false, { message: "Domaine email non autorisé" });
          }

          const user = {
            id: profile.id,
            displayName: profile.displayName,
            email,
            photos: profile.photos,
          };
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticatedAndAllowed(req) {
  const user = req.user;
  if (!user) return false;
  const email = (user.email || "").toLowerCase();
  return email.endsWith(`@${ALLOWED_DOMAIN}`);
}

function requireAuth(req, res, next) {
  // En DEV (ou si AUTH désactivée), on laisse passer
  if (!AUTH_ENABLED || process.env.NODE_ENV !== "production") {
    return next();
  }
  if (isAuthenticatedAndAllowed(req)) {
    return next();
  }
  // Laisse passer l'API health check
  if (req.path.startsWith("/api/health")) {
    return next();
  }
  // Redirige vers Google
  return res.redirect("/auth/google");
}

// Début du flow OAuth
if (AUTH_ENABLED) {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      hd: ALLOWED_DOMAIN, // indicatif côté Google, on revalide côté serveur
      prompt: "select_account",
    })
  );
}

// Callback OAuth
if (AUTH_ENABLED) {
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/forbidden" }),
    (_req, res) => {
      res.redirect("/");
    }
  );
}

// Déconnexion
app.get("/auth/logout", (req, res, next) => {
  if (!AUTH_ENABLED) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
    return;
  }
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/auth/google");
    });
  });
});

// Statut
app.get("/auth/status", (req, res) => {
  if (!AUTH_ENABLED) {
    // En DEV sans auth, on renvoie un faux statut connecté
    return res.json({ authenticated: true, user: { dev: true } });
  }
  if (isAuthenticatedAndAllowed(req)) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.json({ authenticated: false });
});

app.get("/auth/forbidden", (_req, res) => {
  res.status(403).send("Accès refusé : utilisez un email @workandyou.fr");
});

// Multer in-memory storage (no disk write)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Type de fichier non autorisé (PNG ou JPEG uniquement)"));
  },
});

// Multer pour PDF (analyse)
const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB par fichier
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Type de fichier non autorisé (PDF uniquement)"));
  },
});

function sanitizeName(input) {
  return (input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "") // accents
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toIsoStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(
    d.getMinutes()
  )}${pad(d.getSeconds())}`;
}

async function githubGetFileSha(owner, repo, branch, filePath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
    filePath
  )}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "signatures-app",
    },
  });
  if (res.status === 200) {
    const json = await res.json();
    return json.sha || null;
  }
  return null;
}

async function githubPutFile(owner, repo, branch, filePath, contentBase64, message, committer) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`;
  const existingSha = await githubGetFileSha(owner, repo, branch, filePath);
  const body = {
    message,
    content: contentBase64,
    branch,
  };
  if (existingSha) body.sha = existingSha;
  if (committer) body.committer = committer;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "signatures-app",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json;
}

app.post("/api/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!GITHUB_PAT) {
      return res.status(500).json({
        error: "GITHUB_PAT non configuré (ajoutez GITHUB_PAT ou VITE_GITHUB_PAT dans .env.local côté serveur).",
      });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu." });
    }

    const { buffer, mimetype } = req.file;
    const { firstName = "", lastName = "" } = req.body || {};

    const ext = mimetype === "image/png" ? ".png" : ".jpg";
    const nameBase = (sanitizeName(firstName) || "photo") + (lastName ? "-" + sanitizeName(lastName) : "");

    const stamp = toIsoStamp();
    const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 8);
    const fileName = `${nameBase || "photo"}-${stamp}-${hash}${ext}`;
    const repoPath = `uploads/photos/${fileName}`;

    const contentBase64 = buffer.toString("base64");

    const commitMessage = `chore(upload): add ${fileName}`;
    const committer = { name: "Signature Uploader", email: "noreply@example.com" };

    const result = await githubPutFile(
      REPO_OWNER,
      REPO_NAME,
      BRANCH,
      repoPath,
      contentBase64,
      commitMessage,
      committer
    );

    const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${repoPath}`;
    const htmlUrl =
      result?.content?.html_url ||
      `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${repoPath}`;

    res.json({ ok: true, path: repoPath, rawUrl, htmlUrl });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// Analyse de documents (simulation pour l'instant)
app.post("/api/submit-analysis", requireAuth, uploadPdf.array("files", 10), async (req, res) => {
  try {
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
Critère\tPondération\tScore\tPoints pondérés\tCommentaire
Compétences techniques\t40 %\t62 %\t24,8 pts\tDétails et contexte
Expérience métier\t25 %\t68 %\t17 pts\tDétails et contexte
Formation\t15 %\t50 %\t7,5 pts\tDétails et contexte
Personnalité\t15 %\t75 %\t11,25 pts\tDétails et contexte
Motivation\t5 %\t70 %\t3,5 pts\tDétails et contexte
Total\t100 %\t\t64,05 %\tMatching moyen
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

    const prompt = (req.body && req.body.prompt) || DEFAULT_PROMPT;
    const files = Array.isArray(req.files) ? req.files : [];

    // Si une API Python est configurée, on tente d'y relayer la requête.
    if (WORKANDYOU_API_URL) {
      try {
        const endpoint =
          WORKANDYOU_API_URL.endsWith("/submit-analysis")
            ? WORKANDYOU_API_URL
            : `${WORKANDYOU_API_URL.replace(/\/+$/, "")}/submit-analysis`;

        const form = new FormData();
        form.append("prompt", prompt);
        for (const f of files) {
          const blob = new Blob([f.buffer], { type: f.mimetype || "application/pdf" });
          form.append("files", blob, f.originalname || "document.pdf");
        }

        const resp = await fetch(endpoint, { method: "POST", body: form });
        const data = await resp.json();
        if (resp.ok) {
          return res.json(data);
        }
        // eslint-disable-next-line no-console
        console.error("WORKANDYOU_API_URL responded non-200:", resp.status, data);
        // On tombera en simulation ci-dessous
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error contacting WORKANDYOU_API_URL:", e);
        // On tombera en simulation ci-dessous
      }
    }

    // Simulation locale systématique pour l'instant
    await wait(1200);
    const fileNames = files.map((f) => f.originalname).join(", ");
    const result = `Ceci est une réponse simulée.\n\nPrompt: ${prompt || "(vide)"}\nFichiers reçus (${files.length}): ${fileNames || "(aucun)"}\n`;
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// Serve the SPA build when available (production)
if (fs.existsSync(distDir)) {
  app.use(
    requireAuth,
    express.static(distDir, {
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      },
    })
  );

  // Also serve the embedded static signatures assets if needed (safety)
  if (fs.existsSync(publicSignaturesDir)) {
    app.use("/signatures", requireAuth, express.static(publicSignaturesDir));
  }

  // SPA fallback
  app.get("*", requireAuth, (_req, res) => {
    const indexFile = path.join(distDir, "index.html");
    res.sendFile(indexFile);
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});


