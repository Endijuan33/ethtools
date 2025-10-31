import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethereum Address Converter",
  description: "Securely convert mnemonic phrases or private keys to Ethereum public addresses, client-side.",
  icons: {
    icon: "/placeholder-logo.svg",
  },
  openGraph: {
    title: "Ethereum Address Converter",
    description: "Convert mnemonics or private keys to public addresses securely.",
    images: [
      {
        url: "https://ethtools.vercel.app/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Ethereum Address Converter",
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://ethtools.vercel.app/placeholder-logo.png",
    "fc:frame:button:1": "Open App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://ethtools.vercel.app",
    "fc:frame:button:2": "GitHub",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://github.com/endijuan33",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
