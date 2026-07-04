"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface EntranceWrapperProps {
  children: React.ReactNode;
  as?: "div" | "section";
  className?: string;
}

export function EntranceWrapper({ children, as: Tag = "div", className }: EntranceWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  }, []);

  return <Tag ref={ref} className={className} style={{ opacity: 0, transform: "translateY(24px)" }}>{children}</Tag>;
}
