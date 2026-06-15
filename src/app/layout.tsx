import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dev-News",
  description: "Top stories from Hacker News in a clean, readable format",
  icons: { icon: "/favicon.png" },
  other: { "color-scheme": "light dark" },
};

const themeScript = `
  (function() {
    var key = "devnews-theme";
    var theme;
    try { theme = localStorage.getItem(key); } catch(e) {}
    if (!theme) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
