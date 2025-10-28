'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AlertTriangle, Eye, EyeOff, Copy, Check, RefreshCw, Send } from 'lucide-react';
import { Mnemonic, Wallet as EthersWallet, isError } from 'ethers';
import { getBalance, getRoutescanUrl, NETWORKS, Network as NetworkType } from '@/lib/ethers';
import { QRCodeSVG } from 'qrcode.react';
import SendForm from './SendForm';

// Interfaces
interface ImportedWallet {
  address: string;
  privateKey: string;
}

interface Balances {
    [key: string]: { balance: string | null; error: string | null };
}

// The main wallet component
export default function WalletCard() {
  // --- STATE MANAGEMENT ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [wallet, setWallet] = useState<ImportedWallet | null>(null);
  // NEW: State to manage whether we are viewing mainnets or testnets
  const [networkView, setNetworkView] = useState<'mainnet' | 'testnet'>('mainnet');
  const [balances, setBalances] = useState<Balances>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isMasked, setIsMasked] = useState(true);
  const [showReceive, setShowReceive] = useState(false);
  const [sendFromNetwork, setSendFromNetwork] = useState<NetworkType | null>(null);
  const [copied, setCopied] = useState(false);
  const [txSuccess, setTxSuccess] = useState<{ hash: string; network: NetworkType } | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // --- DERIVED STATE ---
  // Check if input is a valid mnemonic phrase
  const { wordCount, isMnemonic } = useMemo(() => {
    const words = inputValue.trim().split(/\s+/).filter(Boolean);
    const count = words.length;
    return { wordCount: count, isMnemonic: [12, 18, 24].includes(count) };
  }, [inputValue]);

  // Filter networks based on the current view (mainnet/testnet)
  const displayedNetworks = useMemo(() => 
    Object.entries(NETWORKS).filter(([, networkDetails]) => networkDetails.type === networkView),
    [networkView]
  );

  // --- HOOKS ---
  // Load wallet from localStorage on mount
  useEffect(() => {
    try {
      const storedWalletJSON = localStorage.getItem('etherWallet');
      if (storedWalletJSON) {
        const storedWallet: ImportedWallet = JSON.parse(storedWalletJSON);
        if (storedWallet.address && storedWallet.privateKey) {
            setWallet(storedWallet);
            setIsUnlocked(true);
        }
      }
    } catch (e) {
        console.error("Error reading wallet from localStorage:", e);
        localStorage.removeItem('etherWallet');
    }
  }, []);

  // Fetch balances for all networks
  const fetchAllBalances = useCallback(async () => {
    if (!wallet?.address) return;
    setIsLoadingBalances(true);
    const newBalances: Balances = {};
    // Fetch balances only for the networks in the current view
    for (const [key] of displayedNetworks) {
        const networkKey = key as NetworkType;
        try {
            const newBalance = await getBalance(wallet.address, networkKey);
            newBalances[networkKey] = { balance: newBalance, error: null };
        } catch (e) {
            if (e instanceof Error) {
              newBalances[networkKey] = { balance: null, error: e.message };
            } else {
              newBalances[networkKey] = { balance: null, error: 'Failed to fetch' };
            }
        }
    }
    setBalances(prev => ({ ...prev, ...newBalances })); // Merge new balances
    setIsLoadingBalances(false);
  }, [wallet?.address, displayedNetworks]);

  // Re-fetch balances when wallet is unlocked or view changes
  useEffect(() => {
    if (wallet?.address && isUnlocked) {
      fetchAllBalances();
    }
  }, [wallet, isUnlocked, fetchAllBalances]);

  // --- ACTION HANDLERS ---
  const handleImport = () => {
    setError('');
    if (!inputValue.trim()) {
      setError('Please enter a mnemonic phrase or private key.');
      return;
    }
    try {
      const trimmedInput = inputValue.trim();
      const importedWallet = isMnemonic
        ? (() => {
            const mnemonic = Mnemonic.fromPhrase(trimmedInput);
            return EthersWallet.fromPhrase(mnemonic.phrase);
          })()
        : new EthersWallet(trimmedInput);

      const walletData = { address: importedWallet.address, privateKey: importedWallet.privateKey };
      setWallet(walletData);
      setIsUnlocked(true);
      localStorage.setItem('etherWallet', JSON.stringify(walletData));
      setInputValue('');
    } catch (e) {
      if (isError(e, 'INVALID_ARGUMENT')) {
        setError('Invalid mnemonic phrase or private key.');
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during import.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('etherWallet');
    setWallet(null);
    setIsUnlocked(false);
    setError('');
    setBalances({});
    setShowLogoutConfirmation(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    });
  };
  
  const handleSendSuccess = (hash: string) => {
      if (sendFromNetwork) {
        setTxSuccess({ hash, network: sendFromNetwork });
        setSendFromNetwork(null);
        fetchAllBalances();
      }
  }

  // --- RENDER LOGIC ---
  // Render the unlocked wallet view
  if (isUnlocked && wallet) {
    return (
        <div className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/20 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Wallet Dashboard</h2>
                {/* NEW: Mainnet/Testnet toggle buttons */}
                <div className="flex items-center bg-black/20 p-1 rounded-lg text-sm font-semibold">
                   <button onClick={() => setNetworkView('mainnet')} className={`px-4 py-1 rounded-md transition-colors ${networkView === 'mainnet' ? 'bg-purple-600' : ''}`}>Mainnets</button>
                   <button onClick={() => setNetworkView('testnet')} className={`px-4 py-1 rounded-md transition-colors ${networkView === 'testnet' ? 'bg-purple-600' : ''}`}>Testnets</button>
                </div>
            </div>

            <div className="bg-black/25 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold capitalize">{networkView} Balances</h3>
                    <button onClick={fetchAllBalances} disabled={isLoadingBalances} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                        <RefreshCw size={20} className={isLoadingBalances ? 'animate-spin' : ''}/>
                    </button>
                </div>
                <div className="space-y-2">
                    {isLoadingBalances && <p className="text-center text-gray-300">Loading balances...</p>}
                    {!isLoadingBalances && displayedNetworks.map(([key, networkInfo]) => {
                       const networkKey = key as NetworkType;
                       const balanceInfo = balances[networkKey];
                       const canSend = balanceInfo?.balance && parseFloat(balanceInfo.balance) > 0;
                       return (
                           <div key={key} className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                               <div>
                                    <span className="font-semibold">{networkInfo.name}</span>
                                    {balanceInfo?.error ? (
                                        <p className="text-red-400 text-xs">Error: {balanceInfo.error}</p>
                                    ) : (
                                        <p className="font-mono text-sm">{balanceInfo?.balance ?? '0.00000'} {networkInfo.currency}</p>
                                    )}
                               </div>
                               <button 
                                    onClick={() => setSendFromNetwork(networkKey)}
                                    disabled={!canSend}
                                    className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center text-sm"
                                >
                                   <Send size={14} className="mr-1.5"/> Send
                               </button>
                           </div>
                       );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setShowReceive(true)} className="bg-blue-600 w-full font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Receive</button>
                 <button onClick={() => setShowLogoutConfirmation(true)} className="bg-red-600 w-full font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Logout
                </button>
            </div>

            {/* Wallet Info */}
            <div className="space-y-3 mt-4">
                <div>
                    <label className="text-sm font-bold text-gray-300 flex items-center">Address <Copy onClick={() => handleCopy(wallet.address)} size={16} className="ml-2 cursor-pointer hover:text-white"/></label>
                    <p className="text-sm text-green-400 break-all bg-black/20 p-2 rounded-lg font-mono">{wallet.address}</p>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300">Private Key</label>
                    <div className="relative">
                        <p className={`text-sm text-orange-400 break-all bg-black/20 p-2 rounded-lg font-mono ${isMasked ? 'blur-sm' : ''}`}>
                            {wallet.privateKey}
                        </p>
                        <button onClick={() => setIsMasked(!isMasked)} className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-white">
                            {isMasked ? <Eye size={18}/> : <EyeOff size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals are unchanged and remain here... */}
            {showLogoutConfirmation && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-full max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
                        <p className="text-gray-300 mb-6">Are you sure? You will need to re-import your wallet.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowLogoutConfirmation(false)} className="bg-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-700">Cancel</button>
                            <button onClick={handleLogout} className="bg-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            )}
            {sendFromNetwork && <SendForm wallet={wallet} network={sendFromNetwork} onClose={() => setSendFromNetwork(null)} onSuccess={handleSendSuccess}/>}
            {txSuccess && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-full max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-2 text-green-400">Transaction Sent!</h3>
                        <p className="text-sm font-mono break-all bg-black/30 p-2 rounded-lg mb-4">{txSuccess.hash}</p>
                        <a href={getRoutescanUrl(txSuccess.hash, txSuccess.network)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mb-4 block">View on Explorer</a>
                        <button onClick={() => setTxSuccess(null)} className="bg-gray-600 w-full font-bold py-2 px-4 rounded-lg hover:bg-gray-700">Close</button>
                    </div>
                </div>
            )}
            {showReceive && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-full max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-2">Your Wallet Address</h3>
                        <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                             <QRCodeSVG value={wallet.address} size={160} />
                        </div>
                        <p className="text-sm font-mono break-all bg-black/30 p-2 rounded-lg mb-4">{wallet.address}</p>
                        <button onClick={() => handleCopy(wallet.address)} className="w-full bg-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-700 mb-2 flex items-center justify-center">
                           {copied ? <><Check size={20} className="mr-2"/> Copied</> : <><Copy size={20} className="mr-2"/> Copy Address</>}
                        </button>
                        <button onClick={() => setShowReceive(false)} className="bg-gray-600 w-full font-bold py-2 px-4 rounded-lg hover:bg-gray-700">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
  }

  // Render the wallet import view
  return (
    <div className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/20 text-white">
      <h2 className="text-xl font-bold text-center mb-2">Import Existing Wallet</h2>
      <p className="text-sm text-gray-400 text-center mb-4">Use a 12, 18, 24-word mnemonic or a private key.</p>
       <div className="relative mb-4">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your mnemonic phrase or private key..."
                className="w-full h-28 p-3 bg-black/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow resize-none"
            />
             <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {inputValue.trim() && (isMnemonic ? <span className="text-green-400">{wordCount} words (Mnemonic)</span> : <span className="text-yellow-400">Private Key</span>)}
            </div>
       </div>
        {error && <p className="text-red-400 text-sm mt-2 mb-2 text-center">{error}</p>}
      <button onClick={handleImport} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
          Import Wallet
      </button>
      <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 text-sm p-3 rounded-lg mt-4 flex">
            <AlertTriangle size={42} className="mr-3 flex-shrink-0" />
            <p><strong>Security Warning:</strong> This tool is intended for development and testing. Do not use a wallet containing substantial funds.</p>
        </div>
    </div>
  );
}
