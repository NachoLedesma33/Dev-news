"use client";

import { memo, useRef, useEffect } from "react";
import { Bookmark, MessageSquare, Clock } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import gsap from "gsap";
import type { NewsItem } from "@/types/news";

interface NewsTableProps {
  items: NewsItem[];
  bookmarks: Set<number>;
  onToggleBookmark: (id: number) => void;
}

export const NewsTable = memo(function NewsTable({ items, bookmarks, onToggleBookmark }: NewsTableProps) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const rows = bodyRef.current?.children;
    if (!rows || rows.length === 0) return;
    gsap.fromTo(rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, stagger: 0.025, duration: 0.35, ease: "power2.out" }
    );
  }, [items]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-dashed-grid text-muted-foreground uppercase tracking-wider">
            <th className="w-16 px-3 py-2 text-right">Score</th>
            <th className="px-3 py-2 text-left">Title</th>
            <th className="w-28 px-3 py-2 text-left">Author</th>
            <th className="w-20 px-3 py-2 text-left">Time</th>
            <th className="w-20 px-3 py-2 text-right">Comments</th>
            <th className="w-10 px-3 py-2 text-center"></th>
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {items.map((item, i) => (
            <tr
              key={item.id}
              className="border-b border-muted/50 odd:bg-muted/30 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 hover:scale-[1.002] transition-all"
            >
              <td className="px-3 py-2.5 text-right font-bold text-orange-500 tabular-nums">
                {item.points}
              </td>
              <td className="px-3 py-2.5">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{item.author}</td>
              <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeAgo(item.published)}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {item.comments}
                </span>
              </td>
              <td className="px-3 py-2.5 text-center">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(item.id); }}
                  className={cn(
                    "text-muted-foreground hover:text-orange-500 transition-colors",
                    bookmarks.has(item.id) && "text-orange-500"
                  )}
                  aria-label={bookmarks.has(item.id) ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark className={cn("size-3.5", bookmarks.has(item.id) && "fill-current")} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
