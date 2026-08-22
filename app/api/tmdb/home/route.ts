import { NextResponse } from "next/server";
import {
  getHeroItems,
  getTrending,
  getStreamingOriginals,
  getByCategory,
} from "@/lib/tmdb-actions";
import { guardApiRoute } from "@/lib/api-guard";

export const revalidate = 3600;

export async function GET(req: Request) {
  const guard = guardApiRoute(req);
  if (guard) return guard;
  try {
    const [hero, trending, streaming, category] = await Promise.all([
      getHeroItems(),
      getTrending("all"),
      getStreamingOriginals("netflix"),
      getByCategory("Action"),
    ]);

    return NextResponse.json({ hero, trending, streaming, category });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch home data" },
      { status: 500 }
    );
  }
}
