"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { deriveAddressFromMnemonic, deriveAddressFromPrivateKey, validateInput, maskPrivateKey } from "../lib/crypto"
import { AddressCard } from "./AddressCard"

interface ConverterFormProps {
  network: "mainnet" | "testnet"
}

export function ConverterForm({ network }: ConverterFormProps) {
  const [input, setInput] = useState("")
  const [address, setAddress] = useState<string | null>(null)
  const [inputType, setInputType] = useState<"mnemonic" | "privateKey" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(async () => {
    setError(null)
    setAddress(null)

    if (!input.trim()) {
      setError("Please enter a mnemonic or private key")
      return
    }

    const validation = validateInput(input)
    if (!validation.valid) {
      setError("Invalid format. Use 12/24 word mnemonic or 64 hex character private key")
      return
    }

    setLoading(true)
    try {
      let derivedAddress: string

      if (validation.type === "mnemonic") {
        derivedAddress = await deriveAddressFromMnemonic(input)
        setInputType("mnemonic")
      } else {
        derivedAddress = deriveAddressFromPrivateKey(input)
        setInputType("privateKey")
      }

      setAddress(derivedAddress)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [input])

  const handleCopyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [address])

  const handleCopyPrivateKey = useCallback(() => {
    if (input && inputType === "privateKey") {
      navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [input, inputType])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="block text-sm font-medium text-foreground">Enter Mnemonic or Private Key</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste mnemonic (12 or 24 words) or private key (64 hex characters)..."
          className="w-full h-32 px-4 py-3 rounded-lg bg-secondary text-foreground placeholder-muted-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <button
          onClick={handleConvert}
          disabled={loading || !input.trim()}
          className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "Processing..." : "Convert to Address"}
        </button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-error/10 border border-error/30 text-error text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Results Section */}
      {address && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Address Card */}
          <AddressCard address={address} network={network} onCopy={handleCopyAddress} copied={copied} />

          {/* Input Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-secondary border border-border"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              {inputType === "mnemonic" ? "Mnemonic Phrase" : "Private Key"}
            </p>
            <div className="flex items-center justify-between gap-2 p-3 rounded bg-background/50 font-mono text-sm break-all">
              <span className="text-foreground/70">
                {inputType === "privateKey" && !showPrivateKey ? maskPrivateKey(input) : input}
              </span>
              <div className="flex gap-2 flex-shrink-0">
                {inputType === "privateKey" && (
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-2 hover:bg-primary/20 rounded transition-colors"
                    title={showPrivateKey ? "Hide" : "Show"}
                  >
                    {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={handleCopyPrivateKey}
                  className="p-2 hover:bg-primary/20 rounded transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">⚠️ Never share this information with anyone</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
