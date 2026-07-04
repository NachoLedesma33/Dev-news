"use client";

import { useState, useMemo, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { NewsCard } from "@/components/news-card";
import { EntranceWrapper } from "@/components/entrance-wrapper";
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
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3 h-64 animate-pulse bg-muted" />
            <div className="lg:col-span-1 space-y-4">
              <div className="h-24 animate-pulse bg-muted" />
              <div className="h-24 animate-pulse bg-muted" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
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
              <EntranceWrapper as="section" className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Top story
                  </h2>
                  <NewsCard item={hero} variant="hero" bookmarked={bookmarks.has(hero.id)} onToggleBookmark={toggleBookmark} />
                </div>
                <aside className="lg:col-span-1 space-y-4">
                  <div className="rounded-none border border-dashed-grid p-4">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Stories</div>
                    <div className="mt-1 text-2xl font-bold font-heading text-orange-500">{filtered.length}</div>
                    <div className="mt-3 h-2 w-full bg-muted overflow-hidden rounded-none">
                      <div className="h-full bg-orange-500 rounded-none" style={{ width: `${items.length > 0 ? (filtered.length / items.length) * 100 : 0}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-right text-muted-foreground">{filtered.length} / {items.length}</div>
                  </div>
                  <div className="rounded-none border border-dashed-grid p-4">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Activity</div>
                    {/* TODO: conectar métrica real */}
                    <div className="mt-3 space-y-2">
                      <div className="h-2 bg-orange-500/70 rounded-none" style={{ width: "85%" }} />
                      <div className="h-2 bg-orange-500/50 rounded-none" style={{ width: "60%" }} />
                      <div className="h-2 bg-orange-500/30 rounded-none" style={{ width: "40%" }} />
                    </div>
                    <div className="mt-1 text-[10px] text-right text-muted-foreground">live feed</div>
                  </div>
                </aside>
              </EntranceWrapper>
            )}

            <EntranceWrapper as="section">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                Latest stories
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <NewsCard key={item.id} item={item} bookmarked={bookmarks.has(item.id)} onToggleBookmark={toggleBookmark} />
                ))}
              </div>
            </EntranceWrapper>
          </>
        )}
      </main>
    </div>
  );
}
