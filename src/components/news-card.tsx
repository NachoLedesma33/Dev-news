"use client";

import { Bookmark, Clock, MessageSquare, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/types/news";
import { useBookmarks } from "@/hooks/use-bookmarks";

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr.replace(" UTC", "Z"));
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface NewsCardProps {
  item: NewsItem;
  variant?: "compact" | "hero";
}

export function NewsCard({ item, variant = "compact" }: NewsCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(item.id);

  if (variant === "hero") {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardContent className="p-6 md:p-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUp className="size-4 text-orange-500" />
            <span className="font-medium text-orange-600">{item.points} points</span>
            <span>·</span>
            <span>by {item.author}</span>
          </div>
          <h2 className="mb-3 text-xl font-bold leading-tight md:text-2xl">{item.title}</h2>
          {item.text && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{item.text}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="size-4" />
              {item.comments} comments
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {timeAgo(item.published)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(item.id)}
              className={cn("ml-auto", bookmarked && "text-orange-500")}
            >
              <Bookmark className={cn("size-5", bookmarked && "fill-current")} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="size-3 text-orange-500" />
            {item.points}
          </span>
          <span>·</span>
          <span>{item.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(item.published)}
          </span>
        </div>
        <h3 className="mb-2 text-sm font-semibold leading-snug group-hover:text-orange-600 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3" />
            {item.comments}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(item.id)}
            className={cn("size-7", bookmarked && "text-orange-500")}
          >
            <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
