# ETH Address Converter 🔐

A secure web application to convert BIP-39 mnemonic or Ethereum private key to public address. **All processes run on the client-side only** — no data is sent to any server.

## ✨ Key Features

- ✅ **Client-Side Only**: All cryptographic processes run in your browser
- ✅ **Mnemonic & Private Key Support**: Accept BIP-39 mnemonic (12/24 words) or private key (64 hex)
- ✅ **Multi-Network**: Support Ethereum Mainnet and Testnet (Sepolia)
- ✅ **Balance Checker**: Check ETH balance directly from the app
- ✅ **Explorer Integration**: Direct links to Routescan for verification
- ✅ **Dark/Light Theme**: Dark theme by default with toggle
- ✅ **Responsive Design**: Works perfectly on desktop and mobile
- ✅ **Security Warnings**: Clear and consistent security warnings

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Steps

1. **Clone or download the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ethereum-address-converter
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Edit \`.env.local\` and add your RPC URLs:
   \`\`\`env
   VITE_RPC_MAINNET=https://eth.llamarpc.com
   VITE_RPC_TESTNET=https://sepolia.infura.io/v3/YOUR_API_KEY
   VITE_DEFAULT_NETWORK=mainnet
   \`\`\`

   **Recommended RPC Providers:**
   - [Infura](https://infura.io) - Free with API key
   - [Alchemy](https://alchemy.com) - Free with API key
   - [QuickNode](https://quicknode.com) - Free with API key
   - [LlamaRPC](https://llamarpc.com) - Public RPC (no key needed)

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   The app will open at \`http://localhost:5173\`

## 📖 Usage Guide

### Using Mnemonic
1. Open the application
2. Select network (Mainnet/Testnet)
3. Paste your mnemonic phrase (12 or 24 words)
4. Click "Convert to Address"
5. Address will be displayed with balance check option

### Using Private Key
1. Open the application
2. Select network (Mainnet/Testnet)
3. Paste your private key (64 hex characters, with or without \`0x\` prefix)
4. Click "Convert to Address"
5. Address will be displayed with reveal/hide private key option

### Check Balance
1. After address is displayed, click "Check Balance" button
2. ETH balance will be shown
3. Click "View on Routescan" to verify on the explorer

## 🔒 Security & Privacy

### ⚠️ IMPORTANT - Read Before Using

1. **Client-Side Only**: This application does NOT send private keys or mnemonics to any server. All cryptographic processes run in your browser.

2. **No Storage**: By default, the application does not store private keys or mnemonics to localStorage or any other storage.

3. **Use on Safe Device**: Only use this application on devices you trust and that are safe from malware.

4. **Never Share Private Key**: Never share your private key or mnemonic with anyone, including this application's developers.

5. **Verify URL**: Make sure you're accessing the application from the correct and trusted URL.

6. **HTTPS Only**: If using in production, ensure the application is accessed via HTTPS.

7. **Backup Mnemonic**: Keep a backup of your mnemonic in a safe place (offline, encrypted, etc.).

### Best Practices

- ✅ Use this application only for address derivation, not for transaction signing
- ✅ Verify address on multiple sources before sending funds
- ✅ Use hardware wallet for long-term fund storage
- ✅ Enable 2FA on exchange and wallet services
- ✅ Backup private key/mnemonic offline

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
\`\`\`

### Project Structure

\`\`\`
src/
├── components/
│   ├── AddressCard.tsx          # Card to display address & balance
│   ├── ConverterForm.tsx        # Form for mnemonic/private key input
│   ├── FooterCredit.tsx         # Footer with credit
│   ├── NetworkSwitch.tsx        # Mainnet/Testnet switch
│   ├── SecurityWarning.tsx      # Security warning
│   └── ThemeToggle.tsx          # Dark/Light theme toggle
├── lib/
│   ├── crypto.ts                # Derivation & validation functions
│   └── ethers.ts                # Provider & balance checking
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
└── index.css                    # Tailwind styles
\`\`\`

### Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **ethers.js v7**: Ethereum library
- **bip39**: Mnemonic handling

## 🌐 Deployment

### Deploy to Vercel (Recommended)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Deploy to Netlify

\`\`\`bash
# Build
npm run build

# Deploy dist folder to Netlify
\`\`\`

### Deploy to GitHub Pages

\`\`\`bash
# Update vite.config.ts with base path
# Then build and push to gh-pages branch
\`\`\`

## 📝 License

MIT License - Free to use for commercial and non-commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Create a Pull Request

## ⚠️ Disclaimer

This application is provided "AS IS" without any warranty. The developer is not responsible for:
- Loss of funds or private keys
- Errors in address derivation
- Network errors or RPC provider issues
- Misuse or non-compliance with best practices

**Use at your own risk and always verify the address before sending funds.**

## 📞 Support

If you find a bug or have questions:
- Open an issue on GitHub
- Contact the developer on GitHub: [@endijuan33](https://github.com/endijuan33)

## 🙏 Credits

Built with ❤️ for the Web3 and Ethereum community.

---

**Remember: Security is paramount. Never share your private key or mnemonic!** 🔐
