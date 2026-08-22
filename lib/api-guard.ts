/**
 * Security helper to verify if an incoming API request originates from the same site / application origin.
 * Protects internal TMDB proxy routes from cross-origin scraping, unauthorized relays, and hotlinking.
 */
export interface VerificationResult {
  isAllowed: boolean;
  reason?: string;
}

export function verifySameOrigin(request: Request): VerificationResult {
  // Allow all requests during local development
  if (process.env.NODE_ENV === "development") {
    return { isAllowed: true };
  }

  const headers = request.headers;
  const secFetchSite = headers.get("sec-fetch-site");
  const referer = headers.get("referer");
  const origin = headers.get("origin");
  const host = headers.get("host") || headers.get("x-forwarded-host");

  // 1. Check Sec-Fetch-Site (modern browser standard header)
  if (secFetchSite === "cross-site") {
    return {
      isAllowed: false,
      reason: "Forbidden: Cross-site requests are strictly prohibited",
    };
  }

  const isSameOriginFetch =
    secFetchSite === "same-origin" || secFetchSite === "same-site";

  if (isSameOriginFetch) {
    return { isAllowed: true };
  }

  // 2. Validate Referer hostname matching host
  if (referer && host) {
    try {
      const refererUrl = new URL(referer);
      // Strip port if comparing or match host
      const refererHost = refererUrl.host;
      if (refererHost === host) {
        return { isAllowed: true };
      }
    } catch {
      // Invalid referer URL format
    }
  }

  // 3. Validate Origin hostname matching host
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host;
      if (originHost === host) {
        return { isAllowed: true };
      }
    } catch {
      // Invalid origin URL format
    }
  }

  // If no same-origin signature is found (e.g. direct scraper curl without headers)
  return {
    isAllowed: false,
    reason: "Forbidden: Direct or unauthorized proxy access is prohibited",
  };
}

export function guardApiRoute(request: Request): Response | null {
  const result = verifySameOrigin(request);
  if (!result.isAllowed) {
    return Response.json(
      { error: result.reason || "Forbidden: Access denied" },
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  return null;
}
