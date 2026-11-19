import { NextRequest, NextResponse } from "next/server";

const GEO_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country",
] as const;

const INVALID_CODES = new Set(["XX", "T1"]);

export function GET(request: NextRequest) {
  let countryCode: string | null = null;

  for (const header of GEO_HEADERS) {
    const raw = request.headers.get(header)?.trim().toUpperCase();
    if (raw && /^[A-Z]{2}$/.test(raw) && !INVALID_CODES.has(raw)) {
      countryCode = raw;
      break;
    }
  }

  return NextResponse.json(
    { countryCode },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
