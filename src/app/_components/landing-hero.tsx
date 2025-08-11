"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function LandingHero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const start = -rect.top;
        const range = viewportHeight;
        const next = Math.min(1, Math.max(0, start / range));
        setProgress(next);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const animateScrollTo = useCallback((targetY: number, duration = 1400) => {
    const startY = window.scrollY;
    const delta = targetY - startY;
    const startTime = performance.now();
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOut(t);
      window.scrollTo({ top: startY + delta * eased });
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  const handleScrollToContent = useCallback(() => {
    const content = document.getElementById("home-content");
    if (!content) return;
    const top = window.scrollY + content.getBoundingClientRect().top;
    animateScrollTo(top, 1400);
  }, [animateScrollTo]);

  const scale = 1 + progress * 0.08;
  const fade = 1 - progress * 0.95;

  return (
    <section aria-label="Intro" className="relative w-full">
      <div ref={wrapperRef} className="h-[180svh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div className="relative h-full w-full">
            <picture className="relative block h-full w-full">
              <source
                media="(max-width: 640px)"
                srcSet="/assets/blog/main_introduction/landing_page_cover_mobile.png"
              />
              <Image
                src="/assets/blog/main_introduction/landing_page_cover.png"
                alt="Intro hero"
                fill
                priority
                sizes="100vw"
                className="object-cover will-change-transform"
                style={{ transform: `scale(${scale})`, opacity: fade }}
              />
            </picture>

            {/* Slightly stronger square vignette (top & bottom only) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/30 via-black/10 to-transparent dark:from-black/35 dark:via-black/20" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/15 to-transparent dark:from-black/40 dark:via-black/25" />

            <button
              aria-label="Scroll to content"
              onClick={handleScrollToContent}
              className="group absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/70 bg-white/25 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 backdrop-blur-md ring-1 ring-white/60 transition will-change-transform hover:bg-white/35 hover:ring-white/80 hover:shadow-black/40 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/90 active:translate-y-[3px]"
            >
              <span className="mr-2 align-middle">Scroll!</span>
              <span className="inline-block align-middle transition-transform group-hover:translate-y-0.5">↓</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 