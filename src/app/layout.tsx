import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devnews — Hacker News, curated",
  description: "Top stories from Hacker News in a clean, readable format",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
