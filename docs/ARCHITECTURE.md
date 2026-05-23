# Architecture

Astramon is currently a static single-page application.

## Runtime

- `index.html` contains the interface, styles, and browser JavaScript.
- `assets/` contains map art, UI art, ball icons, the card back, and NFT card images.
- Solana wallet integration uses the browser wallet provider and Solana Web3 IIFE bundle.
- No backend service is required for local preview or GitHub Pages hosting.

## Pages

The app routes by query string, for example:

- `index.html`
- `index.html?page=monsters`
- `index.html?page=team`
- `index.html?page=market`
- `index.html?page=add-monster`

## NFT Assets

NFT card metadata is loaded from:

```text
data/nft-manifest.json
```

The market renders cards in batches to keep the page responsive. Large card images should be hosted outside GitHub Pages and provided through runtime configuration with `nftImageBaseUrl`, which defaults to the current Cloudflare R2 public bucket URL.

## Deployment

GitHub Actions publishes the repository root to GitHub Pages. `CNAME` configures the custom domain `astramon.fun`.
