"use client";

import { useState, useMemo, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { NewsCard } from "@/components/news-card";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useNews } from "@/hooks/use-news";
import { useDebounce } from "@/hooks/use-debounce";

export default function Home() {
  const { items, loading, error } = useNews();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebounce(searchInput, 300);
  const { bookmarks, toggleBookmark } = useBookmarks();

  const onToggleBookmarks = useCallback(() => setShowBookmarks((v) => !v), []);

  const filtered = useMemo(() => {
    let result = items;

    if (showBookmarks) {
      result = result.filter((n) => bookmarks.has(n.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [showBookmarks, searchQuery, bookmarks, items]);

  const [hero, ...rest] = filtered;

  if (loading) {
    return (
      <div>
        <Navbar
          showBookmarks={showBookmarks}
          onToggleBookmarks={onToggleBookmarks}
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
        />
        <main className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
          <p className="text-lg">Loading stories...</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        showBookmarks={showBookmarks}
        onToggleBookmarks={onToggleBookmarks}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
            Using offline data — API unavailable ({error})
          </div>
        )}

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
                <NewsCard item={hero} variant="hero" bookmarked={bookmarks.has(hero.id)} onToggleBookmark={toggleBookmark} />
              </section>
            )}

            <section>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Latest stories
              </span>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <NewsCard key={item.id} item={item} bookmarked={bookmarks.has(item.id)} onToggleBookmark={toggleBookmark} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
