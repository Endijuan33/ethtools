"use client"

import { motion } from "framer-motion"
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getBalance, getExplorerUrl } from "../lib/ethers"

interface AddressCardProps {
  address: string
  network: "mainnet" | "testnet"
  onCopy: () => void
  copied: boolean
}

export function AddressCard({ address, network, onCopy, copied }: AddressCardProps) {
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  const explorerUrl = getExplorerUrl(address, network)

  useEffect(() => {
    const fetchBalanceAuto = async () => {
      setBalanceLoading(true)
      setBalanceError(null)
      setBalance(null)
      try {
        const bal = await getBalance(address, network)
        setBalance(bal)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch balance"
        console.error("[v0] Error in AddressCard:", errorMsg)
        setBalanceError(errorMsg)
      } finally {
        setBalanceLoading(false)
      }
    }

    if (address && address.length === 42) {
      fetchBalanceAuto()
    }
  }, [address, network])

  const handleRefreshBalance = async () => {
    setBalanceLoading(true)
    setBalanceError(null)
    try {
      const bal = await getBalance(address, network)
      setBalance(bal)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch balance"
      console.error("[v0] Error refreshing balance:", errorMsg)
      setBalanceError(errorMsg)
    } finally {
      setBalanceLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 border border-border overflow-hidden"
    >
      {/* Address */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Ethereum Address</p>
        <div className="flex items-center justify-between gap-2 p-3 rounded bg-background/50 font-mono text-sm break-all">
          <span className="text-foreground">{address}</span>
          <button
            onClick={onCopy}
            className="p-2 hover:bg-primary/20 rounded transition-colors flex-shrink-0"
            title="Copy address"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Balance ({network === "mainnet" ? "Mainnet" : "Testnet"})
          </p>
          <button
            onClick={handleRefreshBalance}
            disabled={balanceLoading}
            className="text-xs px-3 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {balanceLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
        <div className="p-3 rounded bg-background/50">
          {balance !== null ? (
            <p className="font-mono text-lg text-accent font-semibold">{Number.parseFloat(balance).toFixed(4)} ETH</p>
          ) : balanceError ? (
            <p className="text-sm text-error">{balanceError}</p>
          ) : balanceLoading ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching balance...
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Balance will load automatically</p>
          )}
        </div>
      </div>

      {/* Explorer Link */}
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 text-sm font-medium"
      >
        View on Routescan
        <ExternalLink className="h-4 w-4" />
      </a>
    </motion.div>
  )
}
