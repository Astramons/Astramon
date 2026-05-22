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

NFT cards are loaded from:

```text
assets/nft-cards/product-001.JPG
assets/nft-cards/product-002.JPG
...
assets/nft-cards/product-1934.JPG
```

The market renders cards in batches to keep the page responsive.

## Deployment

GitHub Actions publishes the repository root to GitHub Pages. `CNAME` configures the custom domain `astramon.fun`.
