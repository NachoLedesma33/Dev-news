"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

export function AnimatedNumber({ value, duration = 1000 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    const anim = animate(obj, {
      val: value,
      duration,
      easing: "easeOutExpo",
      round: 1,
      update: () => {
        el.textContent = obj.val.toLocaleString();
      },
    });
    return () => { anim.cancel(); };
  }, [value, duration]);

  return <span ref={ref}>0</span>;
}
