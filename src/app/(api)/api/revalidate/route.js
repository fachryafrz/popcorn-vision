import { revalidatePath } from "next/cache";

export async function GET(req) {
  // const path = request.nextUrl.searchParams.get("path");
  const url = new URL(req.url);
  const { path } = Object.fromEntries(url.searchParams);

  if (path) {
    revalidatePath(path, `page`);
    return Response.json({ revalidated: true, now: Date.now(), path });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}
