import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootShell from "./root-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meowww",
  description: "Meowww – multi‑model chat with OpenRouter",
  icons: {
    icon: "/1F924.svg",
    shortcut: "/1F924.svg",
    apple: "/1F924.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
