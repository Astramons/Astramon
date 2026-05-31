import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const indexPath = path.join(root, "index.html");
const html = fs.readFileSync(indexPath, "utf8");

const requiredSnippets = [
  "<title>Astramon</title>",
  "https://astramon.fun/",
  "https://x.com/PlayAstramon",
  "<script src=\"./astramon.config.js\"></script>",
  "const astraTokenMint = readConfigString(\"astraTokenMint\");",
  "const astraTreasuryTokenAccount = readConfigString(\"astraTreasuryTokenAccount\");",
  "const NFT_CARD_COUNT = 1934"
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing required site snippet: ${snippet}`);
  }
}

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
if (inlineScripts.length === 0) {
  throw new Error("No inline script blocks were found in index.html.");
}

for (const [index, code] of inlineScripts.entries()) {
  new vm.Script(code, { filename: `index.inline.${index + 1}.js` });
}

const requiredAssets = [
  "assets/top-scene-image.jpg",
  "assets/pokemon-league-map.jpg",
  "assets/pixel-card-back.svg",
  "assets/nft-front-placeholder.svg",
  "assets/balls/poke-ball.svg",
  "data/nft-manifest.json"
];

for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(root, asset))) {
    throw new Error(`Missing required asset: ${asset}`);
  }
}

const nftDir = path.join(root, "assets/nft-cards");
if (fs.existsSync(nftDir)) {
  const nftCards = fs
    .readdirSync(nftDir)
    .filter((file) => /^product-\d{3,4}\.JPG$/.test(file));

  if (nftCards.length !== 1934) {
    throw new Error(`Expected 1934 NFT card assets, found ${nftCards.length}.`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/nft-manifest.json"), "utf8"));
if (!Array.isArray(manifest.cards) || manifest.cards.length === 0 || manifest.count !== manifest.cards.length) {
  throw new Error("NFT manifest count must match the available card list.");
}

const textFilesToCheck = [
  "index.html",
  "README.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "docs/ARCHITECTURE.md",
  "docs/WALLET_INTEGRATION.md",
  "docs/RELEASE_PROCESS.md",
  "astramon.config.example.js"
];

const hanPattern = /[\p{Script=Han}]/u;
for (const file of textFilesToCheck) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath) && hanPattern.test(fs.readFileSync(filePath, "utf8"))) {
    throw new Error(`Non-English Han characters found in ${file}.`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageJson.private !== true || packageJson.license !== "UNLICENSED") {
  throw new Error("Package metadata must remain private and unlicensed for public package registries.");
}

if (!/Proprietary License/i.test(fs.readFileSync(path.join(root, "LICENSE"), "utf8"))) {
  throw new Error("LICENSE must remain proprietary.");
}

const trackedFiles = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

const highConfidenceSecretPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bsk_live_[A-Za-z0-9]{24,}\b/,
  /\bpk_live_[A-Za-z0-9]{24,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\b(?:mnemonic|seed phrase)\s*[:=]\s*["'][^"']{20,}["']/i,
  /\b(?:password|passwd|private_key|client_secret|api_key)\s*[:=]\s*["'][^"']{8,}["']/i
];

const privateMetadataPatterns = [
  { label: "macOS home directory", pattern: /\/Users\/[A-Za-z0-9._-]+\// },
  { label: "Linux home directory", pattern: /\/home\/[A-Za-z0-9._-]+\// },
  { label: "Windows user directory", pattern: /[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\/ },
  { label: "local machine username", pattern: /\bwuwu\b/i },
  { label: "local machine hostname", pattern: /\bwuwudeMac\b/i },
  { label: "local network hostname", pattern: /(^|[^\w.-])[A-Za-z0-9-]+\.local(?=$|[\s/:])/im },
  { label: "local sugar log metadata", pattern: /\bsugar\.log\b/i }
];

for (const file of trackedFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) continue;
  const buffer = fs.readFileSync(filePath);
  if (buffer.includes(0)) continue;
  const content = buffer.toString("utf8");
  if (hanPattern.test(content)) {
    throw new Error(`Non-English Han characters found in tracked file ${file}.`);
  }
  const hasSecretLikeContent = highConfidenceSecretPatterns.some((pattern) => pattern.test(content));
  if (hasSecretLikeContent) {
    throw new Error(`Potential secret found in tracked file ${file}.`);
  }
  const privateMetadataMatch = privateMetadataPatterns.find(({ pattern }) => pattern.test(content));
  if (privateMetadataMatch) {
    throw new Error(`Private ${privateMetadataMatch.label} found in tracked file ${file}.`);
  }
}

const commitMessages = execFileSync("git", ["log", "--format=%B"], { cwd: root, encoding: "utf8" });
if (hanPattern.test(commitMessages)) {
  throw new Error("Non-English Han characters found in Git commit messages.");
}

console.log("Astramon validation passed.");
