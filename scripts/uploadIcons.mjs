import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

[".env", ".env.local"].forEach((filename) => {
  const envPath = path.join(projectRoot, filename);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
});

const GITHUB_PAT = process.env.GITHUB_PAT || process.env.VITE_GITHUB_PAT;
const REPO_OWNER = process.env.REPO_OWNER || "MatheoWY";
const REPO_NAME = process.env.REPO_NAME || "signatures";
const BRANCH = process.env.BRANCH || "main";
const LOCAL_ICON_DIR = path.join(projectRoot, "public", "signatures", "icones");
const REMOTE_ICON_DIR = "icones";

if (!GITHUB_PAT) {
  console.error("❌ GITHUB_PAT ou VITE_GITHUB_PAT non défini dans .env.local");
  process.exit(1);
}

async function githubGetFileSha(filePath) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(
    filePath
  )}?ref=${encodeURIComponent(BRANCH)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "signature-icon-sync",
    },
  });
  if (res.status === 200) {
    const json = await res.json();
    return json.sha || null;
  }
  if (res.status === 404) return null;
  const text = await res.text();
  throw new Error(`GitHub GET error (${res.status}): ${text}`);
}

async function githubPutFile(filePath, contentBuffer) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(
    filePath
  )}`;
  const existingSha = await githubGetFileSha(filePath);

  const body = {
    message: `chore(icons): sync ${filePath}`,
    content: contentBuffer.toString("base64"),
    branch: BRANCH,
  };
  if (existingSha) body.sha = existingSha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "signature-icon-sync",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT error (${res.status}): ${text}`);
  }
}

async function syncIcons() {
  const entries = await fs.promises.readdir(LOCAL_ICON_DIR, { withFileTypes: true });
  const pngFiles = entries.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"));

  if (pngFiles.length === 0) {
    console.log("Aucun fichier .png trouvé dans", LOCAL_ICON_DIR);
    return;
  }

  for (const entry of pngFiles) {
    const localPath = path.join(LOCAL_ICON_DIR, entry.name);
    const remotePath = `${REMOTE_ICON_DIR}/${entry.name.replace(/\s+/g, "-")}`;
    const buffer = await fs.promises.readFile(localPath);
    await githubPutFile(remotePath, buffer);
    console.log(`✅ Sync: ${entry.name} -> ${remotePath}`);
  }
}

syncIcons().catch((err) => {
  console.error("Erreur durant la synchro des icônes:", err);
  process.exit(1);
});










