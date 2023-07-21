import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "../components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stake Garden",
  description: "Stake your ETH with piece of mind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center justify-between min-h-screen bg-surface-25">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
