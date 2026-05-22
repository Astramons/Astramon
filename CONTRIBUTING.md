# Contributing

Thank you for helping improve Astramon. This repository is private.

## Development Flow

1. Create a branch from `main`.
2. Make focused changes.
3. Run validation:

```bash
npm run validate
```

4. Open a pull request with a clear summary and screenshots for UI changes.

## Code Style

- Keep code, comments, commit messages, and documentation in English.
- Keep the site static unless a backend is explicitly required.
- Preserve the Astramon naming system: full project name `Astramon`, token name `Astra`.
- Avoid adding dependencies unless they clearly reduce risk or complexity.
- Keep UI changes consistent with the bright 16-bit card game style.

## Wallet And NFT Changes

Wallet, payment, and mint logic must be reviewed carefully. Any production minting implementation should use audited Solana programs and clear transaction previews before users sign.
