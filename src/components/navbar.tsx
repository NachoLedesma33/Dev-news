"use client";

import { Bookmark, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface NavbarProps {
  showBookmarks: boolean;
  onToggleBookmarks: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Navbar({ showBookmarks, onToggleBookmarks, searchQuery, onSearchChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="/" className="text-lg font-bold tracking-tight">
          Dev<span className="text-orange-500">news</span>
        </a>

        <div className="relative ml-auto max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9"
            aria-label="Search stories"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmarks}
          className={cn(showBookmarks && "text-orange-500")}
          aria-pressed={showBookmarks}
          aria-label={showBookmarks ? "Show all stories" : "Show bookmarked stories"}
        >
          <Bookmark className="size-5" />
        </Button>
      </div>
    </header>
  );
}
