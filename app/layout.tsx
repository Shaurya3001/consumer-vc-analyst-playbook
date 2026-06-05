import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/layout/SiteFooter";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Consumer VC Analyst Playbook",
  description:
    "An interactive playbook for analysing India's consumer startup ecosystem - funding rounds, brand momentum, category white space, investor syndicates, exits, and unit economics. Built by Shaurya Gulati.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
