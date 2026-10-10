const IMAGE_CONFIG = {
  w45: process.env.NEXT_PUBLIC_API_IMAGE_45,
  w92: process.env.NEXT_PUBLIC_API_IMAGE_92,
  w154: process.env.NEXT_PUBLIC_API_IMAGE_154,
  w185: process.env.NEXT_PUBLIC_API_IMAGE_185,
  w300: process.env.NEXT_PUBLIC_API_IMAGE_300,
  w342: process.env.NEXT_PUBLIC_API_IMAGE_342,
  w500: process.env.NEXT_PUBLIC_API_IMAGE_500,
  w780: process.env.NEXT_PUBLIC_API_IMAGE_780,
  w1280: process.env.NEXT_PUBLIC_API_IMAGE_1280,
  original: process.env.NEXT_PUBLIC_API_IMAGE_ORIGINAL,
} as const;

export type TMDBImageSize = keyof typeof IMAGE_CONFIG;

export const DEFAULT_PLACEHOLDER_IMAGE = "/logo/popcorn.png";

export function getTMDBImageUrl(
  path: string | null | undefined,
  size: TMDBImageSize,
  placeholder: string = DEFAULT_PLACEHOLDER_IMAGE
): string {
  if (!path) return placeholder;

  // External absolute URLs (e.g. gravatar or full CDN links)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = IMAGE_CONFIG[size];
  if (!baseUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[tmdb-image] Missing NEXT_PUBLIC_API_IMAGE_${size.toUpperCase()} environment variable. Please define it in your .env.local file.`
      );
    }
    return placeholder;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * High-definition hero backdrop for desktop (w1280).
 * Prevents loading 4MB-8MB original uncompressed files on desktop.
 */
export function getHeroDesktopBackdropUrl(
  backdropPath: string | null | undefined
): string {
  return getTMDBImageUrl(backdropPath, "w1280");
}

/**
 * Mobile-optimized hero backdrop (w780 textless poster or w342 standard poster).
 * Prevents mobile devices from downloading desktop 1280 or original backdrops.
 */
export function getHeroMobileBackdropUrl(
  textlessPosterPath: string | null | undefined,
  posterPath: string | null | undefined
): string {
  if (textlessPosterPath) {
    return getTMDBImageUrl(textlessPosterPath, "w780");
  }
  return getTMDBImageUrl(posterPath, "w342");
}

/**
 * Standard poster thumbnail for carousels and media cards (w300).
 */
export function getPosterThumbnailUrl(
  posterPath: string | null | undefined
): string {
  return getTMDBImageUrl(posterPath, "w300");
}

/**
 * Landscape still thumbnail for continue watching progress and episodes (w300).
 * TMDB supports stills at w92, w185, w300, and original (w500 is not supported for stills).
 */
export function getStillThumbnailUrl(
  stillPath: string | null | undefined
): string {
  return getTMDBImageUrl(stillPath, "w300");
}

/**
 * Logo thumbnail for titles (w500).
 */
export function getLogoUrl(logoPath: string | null | undefined): string {
  return getTMDBImageUrl(logoPath, "w500");
}
