# Wallet Integration

Astramon uses Solana wallet connection and Astra token payments for the card summon flow.

## Current Frontend Configuration

Astramon runtime wallet settings are injected through `window.ASTRAMON_CONFIG`.

```js
window.ASTRAMON_CONFIG = {
  solanaRpcUrl: "https://api.mainnet-beta.solana.com",
  astraTokenMint: "PASTE_TOKEN_MINT_HERE",
  astraTreasuryTokenAccount: "PASTE_TREASURY_TOKEN_ACCOUNT_HERE",
  astraTokenDecimals: 6
};
```

The production `astramon.config.js` file is generated from deployment secrets and is not committed to the repository.

GitHub Pages does not require additional wallet secrets. Production wallet settings should be provided by a private deployment layer, backend route, or manually uploaded `astramon.config.js` file.

The pack cost is still defined in the app:

```js
const PACK_COST = 100000;
```

## Payment Flow

1. User connects a Solana wallet.
2. The app reads the wallet's Astra token account.
3. The app checks whether the live Astra balance is at least the pack cost.
4. The user signs an SPL Token `TransferChecked` transaction.
5. Astra is transferred to the treasury token account.
6. The frontend reveals a random NFT card image.

## Production NFT Minting

The current implementation is a payment and reveal frontend. To mint real tradable NFTs, connect the flow to an on-chain mint program.

Recommended production setup:

1. Create a Metaplex collection.
2. Upload metadata and image assets to permanent storage.
3. Configure a Candy Machine.
4. Add an Astra token payment guard.
5. Set the destination token account to the project-controlled Astra treasury token account.
6. Update the frontend to create and send the Candy Machine mint transaction.
7. Verify the collection so minted NFTs can trade on [Magic Eden Solana](https://magiceden.io/solana).

## Security Checklist

- Confirm the Astra token mint on mainnet before launch.
- Confirm the treasury token account belongs to the project.
- Test payment on devnet before mainnet.
- Show exact token amount and destination before signature.
- Never request private keys or seed phrases.
