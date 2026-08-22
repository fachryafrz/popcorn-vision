import { NextResponse } from "next/server";
import { getPersonDetails, getPersonCredits } from "@/lib/tmdb-actions";
import { guardApiRoute } from "@/lib/api-guard";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const guard = guardApiRoute(req);
  if (guard) return guard;

  const { id } = await params;

  const [person, credits] = await Promise.all([
    getPersonDetails(id),
    getPersonCredits(id),
  ]);

  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }

  return NextResponse.json({ person, credits });
}
