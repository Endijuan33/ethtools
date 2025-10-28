"use client"

import { motion } from "framer-motion"

interface NetworkSwitchProps {
  network: "mainnet" | "testnet"
  onChange: (network: "mainnet" | "testnet") => void
}

export function NetworkSwitch({ network, onChange }: NetworkSwitchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 p-1 rounded-lg bg-secondary border border-border w-fit"
    >
      {(["mainnet", "testnet"] as const).map((net) => (
        <button
          key={net}
          onClick={() => onChange(net)}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
            network === net ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground hover:text-primary"
          }`}
        >
          {net === "mainnet" ? "Mainnet" : "Testnet"}
        </button>
      ))}
    </motion.div>
  )
}
