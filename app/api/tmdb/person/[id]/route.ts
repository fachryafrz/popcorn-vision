import { NextResponse } from "next/server";
import { getPersonDetails, getPersonCredits } from "@/lib/tmdb-actions";

export const revalidate = 3600;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
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
