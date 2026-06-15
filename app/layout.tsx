import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import GameLayoutWrapper from "@/components/GameLayoutWrapper";

export const metadata: Metadata = {
  title: "ByteBloom - Belajar Coding Seru untuk Anak!",
  description: "Bantu robot lucu Bloomie memecahkan teka-teki coding dengan petualangan yang menyenangkan dan interaktif!",
  keywords: "coding anak, belajar pemrograman, game edukasi, belajar javascript, belajar python",
  authors: [{ name: "ByteBloom Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <GameProvider>
          <GameLayoutWrapper>
            {children}
          </GameLayoutWrapper>
        </GameProvider>
      </body>
    </html>
  );
}
