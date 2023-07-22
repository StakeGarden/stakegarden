import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "../components";
import { inter } from "@/src/app/fonts";

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
