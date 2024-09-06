import { NextResponse } from "next/server";
import { fetchData } from "./lib/fetch";
import { slugify } from "./lib/slugify";

// Example of default export
export default async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const id = pathname.split("-")[0].split("/").pop();
  const isTvPage = pathname.startsWith("/tv");
  const isMoviesPage = pathname.startsWith("/movies");
  const isTvSearchPage = pathname.startsWith("/tv/search");
  const type = isTvPage ? "tv" : "movie";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}?api_key=${process.env.API_KEY}&append_to_response=credits,videos,reviews,watch/providers,recommendations,similar,release_dates`,
  );
  const film = await res.json();
  const slugifiedTitle = slugify(film.title ?? film.name);
  const correctPathname = `/${!isTvPage ? `movies` : `tv`}/${id}${slugify(film.title ?? film.name)}`;

  if ((isMoviesPage || isTvPage) && !isTvSearchPage) {
    if (pathname !== correctPathname && slugifiedTitle !== "") {
      return NextResponse.redirect(new URL(correctPathname, request.url));
    }
  }
}

export const config = {
  matcher: ["/movies/:id/:path*", "/tv/:id/:path*"],
};
