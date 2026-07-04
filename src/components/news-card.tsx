"use client";

import { memo } from "react";
import { Bookmark, Clock, MessageSquare, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import { AnimatedNumber } from "@/components/animated-number";
import type { NewsItem } from "@/types/news";

function handleBookmark(e: React.MouseEvent, id: number, toggle: (id: number) => void) {
  e.preventDefault();
  e.stopPropagation();
  toggle(id);
}

interface NewsCardProps {
  item: NewsItem;
  variant?: "compact" | "hero";
  bookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

function HeroCard({ item, bookmarked, onToggleBookmark }: { item: NewsItem; bookmarked: boolean; onToggleBookmark: (id: number) => void }) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 transition-all hover:shadow-md hover:scale-[1.003]">
      <CardContent className="p-6 md:p-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUp className="size-4 text-orange-500" />
          <span className="font-medium text-orange-600"><AnimatedNumber value={item.points} /> points</span>
          <span>·</span>
          <span>by {item.author}</span>
        </div>
        <h2 className="mb-3 text-xl font-bold leading-tight md:text-2xl text-foreground">{item.title}</h2>
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
            onClick={(e) => handleBookmark(e, item.id, onToggleBookmark)}
            className={cn("ml-auto", bookmarked && "text-orange-500")}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={cn("size-5", bookmarked && "fill-current")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactCard({ item, bookmarked, onToggleBookmark }: { item: NewsItem; bookmarked: boolean; onToggleBookmark: (id: number) => void }) {
  return (
    <Card className="group h-full transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800">
      <CardContent className="flex h-full flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1 font-medium text-orange-500">
            <ArrowUp className="size-3.5" />
            {item.points}
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span>{item.author}</span>
          <span className="text-muted-foreground/30">|</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(item.published)}
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" />
            {item.comments}
          </span>
        </div>
        <div className="grow">
          <h3 className="mb-1.5 text-base font-semibold leading-snug group-hover:text-orange-600 transition-colors text-foreground">
            {item.title}
          </h3>
          {item.text && (
            <p className="text-xs text-muted-foreground line-clamp-2">{item.text}</p>
          )}
        </div>
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleBookmark(e, item.id, onToggleBookmark)}
            className={cn("size-7", bookmarked && "text-orange-500")}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const NewsCard = memo(function NewsCard({ item, variant = "compact", bookmarked, onToggleBookmark }: NewsCardProps) {
  const card = variant === "hero"
    ? <HeroCard item={item} bookmarked={bookmarked} onToggleBookmark={onToggleBookmark} />
    : <CompactCard item={item} bookmarked={bookmarked} onToggleBookmark={onToggleBookmark} />;

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    );
  }

  return <div className="h-full">{card}</div>;
});

export { NewsCard };
