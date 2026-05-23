import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

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
if (manifest.count !== 1934 || !Array.isArray(manifest.cards) || manifest.cards.length !== 1934) {
  throw new Error("NFT manifest must contain 1934 cards.");
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

console.log("Astramon validation passed.");
