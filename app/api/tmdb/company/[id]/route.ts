import { NextResponse } from "next/server";
import {
  getCompanyDetails,
  getCompanyMovies,
  getCompanyTVShows,
} from "@/lib/tmdb-actions";
import { guardApiRoute } from "@/lib/api-guard";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const guard = guardApiRoute(req);
  if (guard) return guard;

  const { id } = await params;

  const [company, movies, tvShows] = await Promise.all([
    getCompanyDetails(id),
    getCompanyMovies(id),
    getCompanyTVShows(id),
  ]);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company, movies, tvShows });
}
