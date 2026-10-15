# Cloudflare Worker - TMDB Reverse Proxy

This Cloudflare Worker serves as a lightweight, zero-cost edge reverse proxy that injects the TMDB API key on Cloudflare's global edge network.

## Benefits
- **Hidden API Key:** The TMDB API key is never exposed in client browser DevTools or bundle JavaScript.
- **Zero Server Compute:** Does not consume any Vercel Serverless Function compute or Convex function calls.
- **Free Tier:** 100,000 requests per day (3,000,000 requests/month) for free without credit card.
- **Edge Caching:** Caches TMDB responses at Cloudflare's global edge network for reduced latency and TMDB quota protection.

## Setup Instructions (2 Minutes)

1. Open the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
2. Click **Create application** &rarr; **Create Worker**.
3. Name it `povi-tmdb-proxy` and click **Deploy**.
4. Click **Edit code**, paste the contents of [`cloudflare/worker.js`](./worker.js), and click **Deploy**.
5. Go to **Settings** &rarr; **Variables & Secrets**:
   - Add a secret named `TMDB_API_KEY` with your TMDB API Key.
   - Click **Save and Deploy**.
6. In your Popcorn Vision environment (`.env.local` or Vercel dashboard):
   ```env
   NEXT_PUBLIC_API_URL="https://povi-tmdb-proxy.<your-subdomain>.workers.dev"
   NEXT_PUBLIC_API_KEY=""
   ```
