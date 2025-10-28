import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Ethereum Address Converter",
  description: "Securely convert mnemonic phrases or private keys to Ethereum public addresses, client-side.",
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
