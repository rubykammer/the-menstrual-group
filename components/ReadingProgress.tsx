"use client";

import { useEffect, useRef } from "react";

/**
 * A thin bar under the sticky header that fills as you read the element
 * with the given id. Decorative: screen readers already know where they are.
 */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.getElementById(target);
    if (!element) return;
    let frame = 0;

    function update() {
      frame = 0;
      const rect = element!.getBoundingClientRect();
      // Full once the end of the text reaches the bottom of the screen
      const distance = rect.height - window.innerHeight;
      const progress =
        distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 1;
      bar.current?.style.setProperty("transform", `scaleX(${progress})`);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [target]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[4.5rem] z-30 h-1"
    >
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-primary to-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
