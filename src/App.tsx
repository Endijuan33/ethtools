"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ConverterForm } from "./components/ConverterForm"
import { NetworkSwitch } from "./components/NetworkSwitch"
import { ThemeToggle } from "./components/ThemeToggle"
import { SecurityWarning } from "./components/SecurityWarning"
import { FooterCredit } from "./components/FooterCredit"

function App() {
  const [network, setNetwork] = useState<"mainnet" | "testnet">("mainnet")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">Ξ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ETH Address Converter</h1>
              <p className="text-xs text-muted-foreground">Client-side only • Secure • Private</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <NetworkSwitch network={network} onChange={setNetwork} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              Secure Ethereum Address Conversion
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Convert BIP-39 mnemonic or private key to Ethereum address securely. All processes run on your client.
            </motion.p>
          </div>

          {/* Security Warning */}
          <SecurityWarning />

          {/* Converter Form */}
          <ConverterForm network={network} />

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-4 mt-12"
          >
            {[
              {
                title: "🔒 Maximum Security",
                description: "All processes run in your browser. Data is never sent to any server.",
              },
              {
                title: "⚡ Instant",
                description: "Convert mnemonic or private key to address in milliseconds.",
              },
              {
                title: "🌐 Multi-Network",
                description: "Support Mainnet and Testnet with direct explorer links to Routescan.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4">
        <FooterCredit />
      </div>
    </div>
  )
}

export default App
