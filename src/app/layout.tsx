import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Personal Finances",
  description: "Personal expense tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-primary`}>
        {children}
      </body>
    </html>
  );
}
