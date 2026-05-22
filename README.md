# Astramon

Astramon is a bright 16-bit Solana card summon, NFT collection, and marketplace interface powered by the Astra token.

- Website: [astramon.fun](https://astramon.fun)
- X: [@PlayAstramon](https://x.com/PlayAstramon)
- Repository: [github.com/Astramons/Astramon](https://github.com/Astramons/Astramon)

## What Is Included

- A responsive single-page Astramon web app in `index.html`.
- Solana wallet connection flow with live Astra balance reads.
- Astra token payment flow for opening NFT card packs.
- NFT market grid powered by local card assets in `assets/nft-cards`.
- GitHub Pages deployment workflow and custom domain support.
- CI validation for inline JavaScript, required assets, project naming, and English-only text files.

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

GitHub Pages does not require additional wallet secrets. If a production wallet flow is needed, provide `astramon.config.js` through your private deployment layer or backend before the page loads. Without runtime wallet configuration, wallet connection can open but live token reads and Astra pack payment are intentionally blocked.

## NFT Minting And Trading

The current site handles wallet connection, Astra balance checks, and Astra payment before revealing a card. For a real tradable Solana NFT mint that appears on Magic Eden, connect the frontend to a Metaplex Candy Machine or another on-chain mint program.

Recommended production path:

1. Create the NFT collection and metadata with Metaplex.
2. Configure Candy Machine guards, including a token payment guard for Astra.
3. Set the Astra treasury token account in the production configuration.
4. Replace the frontend reveal-only flow with a signed mint transaction.
5. Verify collection metadata so minted NFTs can trade on [Magic Eden Solana](https://magiceden.io/solana).

See [docs/WALLET_INTEGRATION.md](docs/WALLET_INTEGRATION.md) for details.

## Deployment

The repository includes a GitHub Pages workflow. Push to `main`, then enable GitHub Pages with "GitHub Actions" as the source if it is not already enabled.

Release tags such as `v0.1.0` create GitHub Releases automatically with `RELEASE_NOTES.md`.

The custom domain is configured through `CNAME`:

```text
astramon.fun
```

## Repository Access

This is a private Astramon project. Source code, visual assets, NFT card assets, and documentation are not open source. See [LICENSE](LICENSE).
