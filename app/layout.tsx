import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// === METADATA (Browser + OpenGraph only) ===
export const metadata: Metadata = {
  title: "EthTools - Ethereum Wallet Utility",
  description: "Secure, client-side Ethereum key tools. Your keys never leave your browser.",
  icons: { icon: "/placeholder-logo.svg" },
  openGraph: {
    title: "EthTools",
    description: "Convert mnemonics, generate wallets, manage keys — all client-side.",
    url: "https://ethtools.vercel.app",
    siteName: "EthTools",
    images: [
      {
        url: "https://ethtools.vercel.app/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "EthTools",
      },
    ],
  },
};

// === Farcaster Mini App Detection & Enhancements ===
function FarcasterMiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Detect if running inside Warpcast Mini App (WebView or iframe)
    const isMiniApp =
      /Warpcast/i.test(navigator.userAgent) ||
      window.location !== window.parent.location;

    if (isMiniApp) {
      // Apply Mini App-specific styles
      document.documentElement.classList.add("farcaster-miniapp");
      document.body.style.overflow = "hidden";
      document.documentElement.style.height = "695px"; // Match Warpcast iframe height

      // Notify Warpcast that app is ready (optional for future SDK use)
      window.postMessage({ type: "farcaster:ready" }, "*");
    }

    // Add close button (X) in top-right corner
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 9999;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = () => {
      window.postMessage({ type: "farcaster:close" }, "*");
    };

    if (isMiniApp) {
      document.body.appendChild(closeBtn);
    }

    // Cleanup on unmount
    return () => {
      if (closeBtn.parentNode) {
        closeBtn.parentNode.removeChild(closeBtn);
      }
    };
  }, []);

  return <>{children}</>;
}

// === Root Layout ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Prevent zoom on mobile WebView */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/placeholder-logo.svg" />
      </head>
      <body className={inter.className}>
        <FarcasterMiniAppProvider>
          {children}
        </FarcasterMiniAppProvider>
      </body>
    </html>
  );
}
