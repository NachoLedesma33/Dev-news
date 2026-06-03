import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dev-News",
  description: "Top stories from Hacker News in a clean, readable format",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
