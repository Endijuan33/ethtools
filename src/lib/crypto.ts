import { mnemonicToSeed, validateMnemonic } from "bip39"
import { HDNodeWallet, Wallet, getAddress } from "ethers"

/**
 * Derive Ethereum address from BIP-39 mnemonic
 * Uses standard Ethereum derivation path: m/44'/60'/0'/0/0
 */
export async function deriveAddressFromMnemonic(mnemonic: string): Promise<string> {
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase")
  }

  const seed = await mnemonicToSeed(mnemonic)
  const hdNode = HDNodeWallet.fromSeed(seed)
  const ethNode = hdNode.derivePath("m/44'/60'/0'/0/0")

  return getAddress(ethNode.address)
}

/**
 * Derive Ethereum address from private key
 */
export function deriveAddressFromPrivateKey(privateKey: string): string {
  try {
    // Remove 0x prefix if present
    const cleanKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`

    // Validate private key length (should be 66 chars with 0x prefix)
    if (cleanKey.length !== 66) {
      throw new Error("Invalid private key length")
    }

    const wallet = new Wallet(cleanKey)
    return getAddress(wallet.address)
  } catch (error) {
    throw new Error("Invalid private key format")
  }
}

/**
 * Validate if input is a valid mnemonic or private key
 */
export function validateInput(input: string): { type: "mnemonic" | "privateKey" | null; valid: boolean } {
  const trimmed = input.trim()

  // Check if it's a mnemonic (12 or 24 words)
  const words = trimmed.split(/\s+/)
  if ((words.length === 12 || words.length === 24) && validateMnemonic(trimmed)) {
    return { type: "mnemonic", valid: true }
  }

  // Check if it's a private key
  try {
    const cleanKey = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`
    if (cleanKey.length === 66 && /^0x[0-9a-fA-F]{64}$/.test(cleanKey)) {
      return { type: "privateKey", valid: true }
    }
  } catch {
    // Continue to return invalid
  }

  return { type: null, valid: false }
}

/**
 * Mask private key for display (show first 6 and last 4 chars)
 */
export function maskPrivateKey(privateKey: string): string {
  const clean = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`
  if (clean.length < 10) return "••••••••••"
  return `${clean.slice(0, 6)}${"•".repeat(clean.length - 10)}${clean.slice(-4)}`
}
