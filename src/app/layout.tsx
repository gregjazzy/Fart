import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TokenProvider } from "./TokenProvider";
import { AuthProvider } from "./auth/AuthProvider";
import PremiumBadgeWrapper from "@/components/PremiumBadgeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traducteur de Pets | Comprendre ce que vos pets veulent dire",
  description: "Le premier outil de traduction de flatulences au monde. Découvrez ce que vos pets essaient vraiment de vous dire!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TokenProvider>
            <PremiumBadgeWrapper />
            {children}
          </TokenProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
