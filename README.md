# Astramon

Astramon is a bright 16-bit Solana card summon, NFT collection, and marketplace interface powered by the Astra token.

- Website: [astramon.fun](https://astramon.fun)
- X: [@PlayAstramon](https://x.com/PlayAstramon)
- Repository: [github.com/Astramons/Astramon](https://github.com/Astramons/Astramon)

## What Is Included

- A responsive single-page Astramon web app in `index.html`.
- Solana wallet connection flow with live Astra balance reads.
- Astra token payment flow for opening NFT card packs.
- NFT market grid powered by `data/nft-manifest.json`.
- GitHub Pages deployment workflow and custom domain support.

## Local Development

This site is static and can run without a build step.

```bash
npm run validate
```

To preview locally, serve the folder with any static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Wallet Configuration

Before production launch, set the live Astra SPL token mint and treasury token account through runtime configuration. The committed app reads `window.ASTRAMON_CONFIG`; it does not store production wallet configuration in source control.

For local testing, copy the example file and fill your private values:

```bash
cp astramon.config.example.js astramon.config.js
```

`astramon.config.js` is ignored by Git.

GitHub Pages does not require additional wallet secrets. If a production wallet flow is needed, provide `astramon.config.js` through your private deployment layer or backend before the page loads. Without runtime wallet configuration, wallet connection can open but live token reads and Candy Machine minting are intentionally blocked.

## NFT Minting And Trading

The current site handles wallet connection, Astra balance checks, and Metaplex Candy Machine minting before revealing a card.

Current production path:

1. Create the NFT collection and metadata with Metaplex.
2. Configure Candy Machine guards, including a Token-2022 payment guard for Astra.
3. Set the Astra treasury token account and Candy Machine IDs in the production configuration.
4. Build `assets/astramon-mint.js` with `npm run build:mint`.
5. Verify collection metadata so minted NFTs can trade on [Magic Eden Solana](https://magiceden.io/solana).

See [docs/WALLET_INTEGRATION.md](docs/WALLET_INTEGRATION.md) for details.

## NFT Image Hosting

Astramon expects NFT images at:

```text
https://pub-b3acfc620a4846df963fba9e466f6c45.r2.dev/nft-cards/product-001.JPG
https://pub-b3acfc620a4846df963fba9e466f6c45.r2.dev/nft-cards/product-002.JPG
...
```

Upload the full `nft-cards` folder to Cloudflare R2, then expose the bucket through the R2 public development URL or a custom domain such as `cdn.astramon.fun`. Once that is live, the market and summon views will load real NFT art automatically.

## Deployment

The repository includes a GitHub Pages workflow. Push to `main`, then enable GitHub Pages with "GitHub Actions" as the source if it is not already enabled.

Release tags such as `v0.1.0` create GitHub Releases automatically with `RELEASE_NOTES.md`.

The custom domain is configured through `CNAME`:

```text
astramon.fun
```

## Repository Access

This is a private Astramon project. Source code, visual assets, NFT card assets, and documentation are not open source. See [LICENSE](LICENSE).
