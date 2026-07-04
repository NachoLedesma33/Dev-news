"use client";

import { Bookmark, Search, Moon, Sun, Command } from "lucide-react";
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
  const sw = 1.5;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-10 max-w-6xl items-center gap-3 px-4">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold font-heading tracking-tight shrink-0">
          Dev<span className="text-orange-500">news</span>
        </a>

        <span className="hidden sm:inline text-xs text-muted-foreground/60 select-none">root &gt; latest_news</span>

        <div className="relative ml-auto max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={sw} />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 pr-14 text-xs"
            aria-label="Search stories"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60 bg-muted/50">
            <Command className="size-3" strokeWidth={sw} />K
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="size-4" strokeWidth={sw} /> : <Moon className="size-4" strokeWidth={sw} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmarks}
          className={cn("size-8", showBookmarks && "text-orange-500")}
          aria-pressed={showBookmarks}
          aria-label={showBookmarks ? "Show all stories" : "Show bookmarked stories"}
        >
          <Bookmark className="size-4" strokeWidth={sw} />
        </Button>
      </div>
    </header>
  );
}
