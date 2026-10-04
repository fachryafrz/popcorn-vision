import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const convexClient = new ConvexHttpClient(
  convexUrl || "https://placeholder-convex-url.convex.cloud"
);
