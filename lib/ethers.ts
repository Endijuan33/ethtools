'use client';
import { Mnemonic, HDNodeWallet, Wallet, isAddress, JsonRpcProvider, formatEther, Contract, formatUnits } from 'ethers';

// Add a 'type' property to classify networks and remove deprecated ones
export const NETWORKS = {
  mainnet: {
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.public.blastapi.io",
    explorerUrl: "https://etherscan.io",
    currency: "ETH",
    type: 'mainnet' as const,
  },
  optimism: {
    name: "Optimism",
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    currency: "ETH",
    type: 'mainnet' as const,
  },
  arbitrum: {
    name: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    currency: "ETH",
    type: 'mainnet' as const,
  },
  polygon: {
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    currency: "MATIC",
    type: 'mainnet' as const,
  },
  bsc: {
    name: "BNB Smart Chain",
    rpcUrl: "https://binance.llamarpc.com", // Updated RPC
    explorerUrl: "https://bscscan.com",
    currency: "BNB",
    type: 'mainnet' as const,
  },
  base: {
    name: "Base",
    rpcUrl: "https://base.llamarpc.com",
    explorerUrl: "https://basescan.org",
    currency: "ETH",
    type: 'mainnet' as const,
  },
  sepolia: {
    name: "Sepolia Testnet",
    rpcUrl: "https://eth-sepolia.public.blastapi.io",
    explorerUrl: "https://sepolia.etherscan.io",
    currency: "SepoliaETH",
    type: 'testnet' as const,
  },
  "base-sepolia": {
    name: "Base Sepolia",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    explorerUrl: "https://sepolia.basescan.org/",
    currency: "BaseSepoliaETH",
    type: 'testnet' as const,
  },
  holesky: { // Replaced Polygon zkEVM
    name: "Ethereum Holesky",
    rpcUrl: "https://ethereum-holesky-rpc.publicnode.com",
    explorerUrl: "https://holesky.etherscan.io",
    currency: "HoleskyETH",
    type: 'testnet' as const,
  },
  "optimism-sepolia": {
    name: "Optimism Sepolia",
    rpcUrl: "https://sepolia.optimism.io",
    explorerUrl: "https://sepolia-optimism.etherscan.io",
    currency: "OpSepoliaETH",
    type: 'testnet' as const,
  },
  "arbitrum-sepolia": {
    name: "Arbitrum Sepolia",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorerUrl: "https://sepolia.arbiscan.io",
    currency: "ArbSepoliaETH",
    type: 'testnet' as const,
  },
  hoodi: {
    name: "Hoodi Testnet",
    rpcUrl: "https://0xrpc.io/hoodi",
    explorerUrl: "https://hoodi.etherscan.io",
    currency: "HoodiETH",
    type: 'testnet' as const,
  },
  unichain: {
    name: "Unichain Testnet",
    rpcUrl: "https://unichain-sepolia-rpc.publicnode.com",
    explorerUrl: "https://unichain-sepolia.blockscout.com/",
    currency: "UnichainETH",
    type: 'testnet' as const,
  },
};

export type Network = keyof typeof NETWORKS;

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
];

export const getProvider = (network: Network) => {
    const rpcUrl = NETWORKS[network].rpcUrl;
    if (!rpcUrl) throw new Error(`RPC URL not found for network: ${network}`);
    return new JsonRpcProvider(rpcUrl);
}

export function getAddressFromMnemonic(mnemonic: string): string {
  try {
    const mnemonicInstance = Mnemonic.fromPhrase(mnemonic);
    const node = HDNodeWallet.fromMnemonic(mnemonicInstance, `m/44'/60'/0'/0/0`);
    return node.address;
  } catch {
    throw new Error('Invalid mnemonic phrase.');
  }
}

export function getAddressFromPrivateKey(privateKey: string): string {
  try {
    const wallet = new Wallet(privateKey);
    return wallet.address;
  } catch {
    throw new Error('Invalid private key.');
  }
}

export function getRoutescanUrl(addressOrTxHash: string, network: Network): string {
  const explorerUrl = NETWORKS[network].explorerUrl;
  if (!explorerUrl) return ""; // Return empty if no explorer is configured
  const path = addressOrTxHash.length === 42 ? 'address' : 'tx';
  return `${explorerUrl}/${path}/${addressOrTxHash}`;
}

export async function getBalance(address: string, network: Network): Promise<string> {
    if (!isAddress(address)) throw new Error('Invalid address.');
    const provider = getProvider(network);
    try {
        const balanceWei = await provider.getBalance(address);
        return parseFloat(formatEther(balanceWei)).toFixed(5);
    } catch (error) {
        console.error(`Failed to fetch balance for ${network}:`, error);
        throw new Error(`Could not fetch ETH balance on ${NETWORKS[network].name}.`);
    }
}

export async function getTokenDetails(contractAddress: string, network: Network) {
    if (!isAddress(contractAddress)) throw new Error('Invalid contract address.');
    const provider = getProvider(network);
    const contract = new Contract(contractAddress, ERC20_ABI, provider);
    try {
        const [name, symbol, decimals] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals()
        ]);
        return { name, symbol, decimals: Number(decimals) };
    } catch {
        throw new Error('Failed to fetch token details. Make sure the address is a valid ERC20 contract on the selected network.');
    }
}

export async function getTokenBalance(contractAddress: string, userAddress: string, network: Network) {
    if (!isAddress(contractAddress) || !isAddress(userAddress)) throw new Error('Invalid address.');
    const provider = getProvider(network);
    const contract = new Contract(contractAddress, ERC20_ABI, provider);
    try {
        const balance = await contract.balanceOf(userAddress);
        const decimals = await contract.decimals();
        return parseFloat(formatUnits(balance, decimals)).toFixed(4);
    } catch {
        throw new Error('Failed to fetch token balance.');
    }
}

/**
 * Generates an explorer link specifically for the Converter and Generator pages.
 * This function is isolated from the wallet's network configuration and uses environment variables.
 * @param hash The address hash.
 * @param network The network context ('mainnet' or 'sepolia').
 * @returns The full URL to the Routescan explorer for the address.
 */
export function getConverterExplorerUrl(hash: string, network: 'mainnet' | 'sepolia'): string {
    const type = 'address';
    let baseUrl: string;

    if (network === 'mainnet') {
        baseUrl = process.env.NEXT_PUBLIC_ROUTESCAN_MAINNET_URL || 'https://routescan.io';
    } else { // 'sepolia'
        baseUrl = process.env.NEXT_PUBLIC_ROUTESCAN_TESTNET_URL || 'https://testnet.routescan.io';
    }

    return `${baseUrl}/${type}/${hash}`;
}
