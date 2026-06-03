export function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Dev-News</p>
        <p className="mt-1">
          Built by{" "}
          <a
            href="https://github.com/NachoLedesma33"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Nacho
          </a>
        </p>
        <p className="mt-1">
          Powered by{" "}
          <a
            href="https://news.ycombinator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Hacker News
          </a>
        </p>
        <p className="mt-3 text-xs">
          &copy; {new Date().getFullYear()} Dev-News. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
