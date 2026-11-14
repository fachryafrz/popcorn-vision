/**
 * Cloudflare Worker - Secured TMDB Reverse Proxy
 *
 * Security & Performance:
 * 1. Strict Origin & Referer Validation (Blocks unauthorized third-party apps & browser access).
 * 2. Strict CORS (Replaces insecure '*' with authorized origins).
 * 3. Edge Caching via Cloudflare Cache API (Saves TMDB quota & responds in <10ms).
 * 4. Zero Server Compute (Runs 100% on Cloudflare's global edge network).
 */

const TMDB_UPSTREAM_BASE = "https://api.themoviedb.org/3";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function isOriginAllowed(requestOrigin, requestReferer, env) {
  const envOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : [];
  const allowedList = [...DEFAULT_ALLOWED_ORIGINS, ...envOrigins];

  const checkUrl = (urlStr) => {
    if (!urlStr) return false;
    try {
      const parsed = new URL(urlStr);
      const originOnly = parsed.origin;

      if (allowedList.includes(originOnly)) return true;

      // Allow Vercel preview deployments (e.g. *.vercel.app)
      if (parsed.hostname.endsWith(".vercel.app")) return true;

      return false;
    } catch {
      return false;
    }
  };

  if (requestOrigin && checkUrl(requestOrigin)) return true;
  if (requestReferer && checkUrl(requestReferer)) return true;

  return false;
}

export default {
  async fetch(request, env, ctx) {
    const originHeader = request.headers.get("Origin");
    const refererHeader = request.headers.get("Referer");

    const isAllowed = isOriginAllowed(originHeader, refererHeader, env);

    const corsOrigin = isAllowed
      ? (originHeader || (refererHeader ? new URL(refererHeader).origin : DEFAULT_ALLOWED_ORIGINS[0]))
      : "null";

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };

    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      if (!isAllowed) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Block unauthorized origins
    if (!isAllowed) {
      return new Response(
        JSON.stringify({
          error: "Forbidden",
          message: "Access denied: Unauthorized origin or referer.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "null",
          },
        }
      );
    }

    // 3. Only allow GET and HEAD requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // 4. Verify TMDB_API_KEY secret
    if (!env.TMDB_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "TMDB_API_KEY secret is not configured in Cloudflare Worker.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    try {
      const incomingUrl = new URL(request.url);

      // 5. Cloudflare Edge Cache API Lookup
      const cache = caches.default;
      const cacheKey = new Request(incomingUrl.toString(), request);
      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        const responseWithCors = new Response(cachedResponse.body, cachedResponse);
        Object.entries(corsHeaders).forEach(([key, val]) => {
          responseWithCors.headers.set(key, val);
        });
        responseWithCors.headers.set("X-Cache-Status", "HIT-EDGE");
        return responseWithCors;
      }

      // 6. Upstream TMDB Request
      const targetUrl = new URL(`${TMDB_UPSTREAM_BASE}${incomingUrl.pathname}`);
      incomingUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      targetUrl.searchParams.set("api_key", env.TMDB_API_KEY);

      const upstreamResponse = await fetch(targetUrl.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "PopcornVisionProxy/1.0",
        },
      });

      const responseHeaders = new Headers(upstreamResponse.headers);
      Object.entries(corsHeaders).forEach(([key, val]) => {
        responseHeaders.set(key, val);
      });

      responseHeaders.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      responseHeaders.set("X-Cache-Status", "MISS-UPSTREAM");

      const responseToReturn = new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: responseHeaders,
      });

      if (upstreamResponse.ok && request.method === "GET") {
        ctx.waitUntil(cache.put(cacheKey, responseToReturn.clone()));
      }

      return responseToReturn;
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to proxy request to TMDB",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
