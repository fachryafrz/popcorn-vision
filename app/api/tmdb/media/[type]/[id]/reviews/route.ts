import { NextRequest, NextResponse } from "next/server";
import { getMediaReviews } from "@/lib/tmdb-actions";
import { guardApiRoute } from "@/lib/api-guard";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ type: string; id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const guard = guardApiRoute(req);
  if (guard) return guard;

  const { type, id } = await params;

  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;

  const data = await getMediaReviews(type, id, page);

  if (!data) {
    return NextResponse.json({
      id: Number(id) || 0,
      page,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  return NextResponse.json(data);
}
