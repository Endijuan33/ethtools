// app/layout.tsx  ← MUST BE THIS NAME
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

// === METADATA (Server Component) ===
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/placeholder-logo.svg" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
