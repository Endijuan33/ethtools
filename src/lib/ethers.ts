import { JsonRpcProvider, formatEther } from "ethers"

/**
 * Get RPC URL based on network
 * Added safe access to import.meta.env with proper fallback handling
 */
function getRpcUrl(network: "mainnet" | "testnet"): string {
  // Safe access to import.meta.env - handle cases where it might be undefined
  let rpcUrl: string | undefined

  try {
    const env = import.meta.env || {}
    if (network === "mainnet") {
      rpcUrl = env.VITE_RPC_MAINNET
    } else {
      rpcUrl = env.VITE_RPC_TESTNET
    }
  } catch (e) {
    console.warn("[v0] Could not access import.meta.env, using fallback RPC")
  }

  // Use fallback RPC if env variable not available
  if (!rpcUrl) {
    if (network === "mainnet") {
      console.warn("[v0] VITE_RPC_MAINNET not configured, using fallback RPC")
      return "https://eth.llamarpc.com"
    } else {
      console.warn("[v0] VITE_RPC_TESTNET not configured, using fallback RPC")
      return "https://eth-sepolia.g.alchemy.com/v2/demo"
    }
  }

  return rpcUrl
}

/**
 * Create provider instance
 */
export function createProvider(network: "mainnet" | "testnet"): JsonRpcProvider {
  const rpcUrl = getRpcUrl(network)
  console.log("[v0] Creating provider for", network, "with RPC:", rpcUrl)
  return new JsonRpcProvider(rpcUrl)
}

/**
 * Get balance for an address
 */
export async function getBalance(address: string, network: "mainnet" | "testnet"): Promise<string> {
  try {
    // Validate address format
    if (!address || address.length < 42) {
      throw new Error("Invalid Ethereum address format")
    }

    const provider = createProvider(network)
    console.log("[v0] Fetching balance for address:", address)

    const balance = await provider.getBalance(address)
    console.log("[v0] Balance fetched successfully:", balance.toString())

    return formatEther(balance)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Balance fetch error:", errorMessage)
    throw new Error(`Balance fetch failed: ${errorMessage}`)
  }
}

/**
 * Get Routescan explorer URL
 */
export function getExplorerUrl(address: string, network: "mainnet" | "testnet"): string {
  if (network === "mainnet") {
    return `https://routescan.io/address/${address}`
  } else {
    return `https://testnet.routescan.io/address/${address}`
  }
}
