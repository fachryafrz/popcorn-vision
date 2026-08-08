import { NextResponse } from "next/server";
import { getMediaDetails } from "@/lib/tmdb-actions";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ type: string; id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { type, id } = await params;

  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  const data = await getMediaDetails(type, id);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
