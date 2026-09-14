"use client";

import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/navigation";

// Global cache to avoid duplicate prefetch calls across components within the same session
const prefetchedUrls = new Set<string>();

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  /**
   * Whether to prefetch the route on hover, focus, or touch start.
   * @default true
   */
  hoverPrefetch?: boolean;
  children?: React.ReactNode;
}

/**
 * Reusable Link component that optimizes Next.js page transitions by prefetching
 * routes just-in-time on hover (`onMouseEnter`/`onPointerEnter`), focus (`onFocus`),
 * or touch start (`onTouchStart`) rather than eagerly prefetching on viewport entry.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      href,
      hoverPrefetch = true,
      prefetch,
      onMouseEnter,
      onPointerEnter,
      onFocus,
      onTouchStart,
      ...props
    },
    ref,
  ) {
    const router = useRouter();

    const getHrefString = React.useCallback((): string | null => {
      if (typeof href === "string") {
        return href;
      }
      if (
        href &&
        typeof href === "object" &&
        "pathname" in href &&
        typeof href.pathname === "string"
      ) {
        return href.pathname;
      }
      return null;
    }, [href]);

    const performPrefetch = React.useCallback(() => {
      if (!hoverPrefetch) return;
      const targetUrl = getHrefString();
      if (
        !targetUrl ||
        targetUrl.startsWith("#") ||
        targetUrl.startsWith("http://") ||
        targetUrl.startsWith("https://")
      ) {
        return;
      }

      if (!prefetchedUrls.has(targetUrl)) {
        prefetchedUrls.add(targetUrl);
        router.prefetch(targetUrl);
      }
    }, [hoverPrefetch, getHrefString, router]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      performPrefetch();
      onMouseEnter?.(e);
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLAnchorElement>) => {
      performPrefetch();
      onPointerEnter?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
      performPrefetch();
      onFocus?.(e);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
      performPrefetch();
      onTouchStart?.(e);
    };

    // If hoverPrefetch is active and prefetch isn't explicitly set, default prefetch to false to disable viewport prefetching
    const resolvedPrefetch =
      prefetch !== undefined ? prefetch : hoverPrefetch ? false : undefined;

    return (
      <NextLink
        ref={ref}
        href={href}
        prefetch={resolvedPrefetch}
        onMouseEnter={handleMouseEnter}
        onPointerEnter={handlePointerEnter}
        onFocus={handleFocus}
        onTouchStart={handleTouchStart}
        {...props}
      />
    );
  },
);

Link.displayName = "Link";

export default Link;
