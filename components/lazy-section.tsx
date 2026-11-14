"use client";

import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  id?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export default function LazySection({
  id,
  children,
  fallback,
  rootMargin = "350px 0px",
}: LazySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (hasEntered) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered, rootMargin]);

  return (
    <div ref={containerRef} id={id}>
      {hasEntered
        ? children
        : (fallback ?? <div className="min-h-80 w-full" aria-hidden="true" />)}
    </div>
  );
}
