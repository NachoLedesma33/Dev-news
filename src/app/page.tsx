"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { NewsCard } from "@/components/news-card";
import { mockNews } from "@/lib/mock-data";
import { useBookmarks } from "@/hooks/use-bookmarks";

export default function Home() {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { bookmarks } = useBookmarks();

  const filtered = useMemo(() => {
    let items = mockNews;

    if (showBookmarks) {
      items = items.filter((n) => bookmarks.has(n.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
      );
    }

    return items;
  }, [showBookmarks, searchQuery, bookmarks]);

  const [hero, ...rest] = filtered;

  return (
    <div className="min-h-screen">
      <Navbar
        showBookmarks={showBookmarks}
        onToggleBookmarks={() => setShowBookmarks((v) => !v)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No stories found</p>
            <p className="text-sm">Try adjusting your search or bookmarks filter.</p>
          </div>
        ) : (
          <>
            {hero && (
              <section className="mb-8">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top story
                </span>
                <NewsCard item={hero} variant="hero" />
              </section>
            )}

            <section>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Latest stories
              </span>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
