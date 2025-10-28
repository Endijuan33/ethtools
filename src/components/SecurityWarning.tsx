"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export function SecurityWarning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-lg border border-error/30 bg-error/10 p-4"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-error" />
        <div className="text-sm text-foreground">
          <p className="font-semibold mb-1">⚠️ Security Warning</p>
          <ul className="space-y-1 text-xs opacity-90">
            <li>• All processes run on the client-side only</li>
            <li>• Private keys and mnemonics are NOT sent to any server</li>
            <li>• Never share your private key or mnemonic with anyone</li>
            <li>• Use only on safe and trusted devices</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
