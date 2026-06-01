import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine
} from "@metaplex-foundation/mpl-candy-machine";
import {
  generateSigner,
  publicKey
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { base58 } from "@metaplex-foundation/umi/serializers";

function requireConfigValue(config, key) {
  const value = config?.[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${key} in astramon.config.js`);
  }
  return value.trim();
}

async function ensureConnected(provider) {
  if (!provider) throw new Error("Connect wallet first.");
  if (!provider.publicKey && typeof provider.connect === "function") {
    await provider.connect();
  }
  if (!provider.publicKey) throw new Error("Connect wallet first.");
}

async function mintAstramonNft({ config, provider, onStatus } = {}) {
  await ensureConnected(provider);
  const rpcUrl = requireConfigValue(config, "solanaRpcUrl");
  const candyMachineId = requireConfigValue(config, "candyMachineId");
  const candyGuardId = requireConfigValue(config, "candyGuardId");
  const collectionMint = requireConfigValue(config, "collectionMint");
  const astraTokenMint = requireConfigValue(config, "astraTokenMint");
  const astraTreasuryTokenAccount = requireConfigValue(config, "astraTreasuryTokenAccount");

  onStatus?.("Preparing mint");
  const umi = createUmi(rpcUrl)
    .use(mplCandyMachine())
    .use(walletAdapterIdentity(provider));

  const candyMachineKey = publicKey(candyMachineId);
  const nftMint = generateSigner(umi);
  const candyMachine = await fetchCandyMachine(umi, candyMachineKey);

  onStatus?.("Confirm in wallet");
  const { signature } = await mintV2(umi, {
    candyMachine: candyMachineKey,
    candyGuard: publicKey(candyGuardId),
    nftMint,
    collectionMint: publicKey(collectionMint),
    collectionUpdateAuthority: candyMachine.authority,
    tokenStandard: TokenStandard.NonFungible,
    mintArgs: {
      token2022Payment: {
        mint: publicKey(astraTokenMint),
        destinationAta: publicKey(astraTreasuryTokenAccount)
      }
    }
  }).sendAndConfirm(umi, {
    send: { skipPreflight: false },
    confirm: { commitment: "confirmed" }
  });

  return {
    signature: base58.serialize(signature),
    nftMint: nftMint.publicKey.toString(),
    candyMachine: candyMachineId
  };
}

window.AstramonCandyMint = {
  mintAstramonNft
};
