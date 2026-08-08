import { NextResponse } from "next/server";
import { getTMDBGenres, getTMDBProviders } from "@/lib/tmdb-actions";

export const revalidate = 86400; // 1 day — genres & providers rarely change

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get("countryCode") || "US";

  const [genres, providers] = await Promise.all([
    getTMDBGenres(),
    getTMDBProviders(countryCode),
  ]);

  return NextResponse.json({ genres, providers });
}
