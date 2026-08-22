import { NextResponse } from "next/server";
import { getTMDBGenres, getTMDBProviders } from "@/lib/tmdb-actions";
import { guardApiRoute } from "@/lib/api-guard";

export const revalidate = 86400; // 1 day — genres & providers rarely change

export async function GET(req: Request) {
  const guard = guardApiRoute(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get("countryCode") || "US";

  const [genres, providers] = await Promise.all([
    getTMDBGenres(),
    getTMDBProviders(countryCode),
  ]);

  return NextResponse.json({ genres, providers });
}
