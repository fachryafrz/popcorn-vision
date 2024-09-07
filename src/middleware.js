import { NextResponse } from "next/server";
import { fetchData } from "./lib/fetch";
import { slugify } from "./lib/slugify";
import { cookies } from "next/headers";
import { tmdb_session_id } from "./lib/constants";

// Example of default export
export default async function middleware(request) {
  const cookiesStore = request.cookies;
  const { pathname, searchParams } = request.nextUrl;

  const isTvPage = pathname.startsWith("/tv");
  const isMoviesPage = pathname.startsWith("/movies");
  const isTvSearchPage = pathname.startsWith("/tv/search");
  const type = isTvPage ? "tv" : "movie";
  const tmdbSessionID = cookiesStore.has(tmdb_session_id);

  if ((isMoviesPage || isTvPage) && !isTvSearchPage) {
    const id = pathname.split("-")[0].split("/").pop();
    const film = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}?api_key=${process.env.API_KEY}&append_to_response=credits,videos,reviews,watch/providers,recommendations,similar,release_dates`,
    ).then((res) => res.json());
    const slugifiedTitle = slugify(film.title ?? film.name);
    const correctPathname = `/${!isTvPage ? `movies` : `tv`}/${id}${slugify(film.title ?? film.name)}`;

    if (pathname !== correctPathname && slugifiedTitle !== "") {
      return NextResponse.redirect(new URL(correctPathname, request.url));
    }
  }

  const isLoginPage = pathname.startsWith("/login");
  const isProfilePage = pathname.startsWith("/profile");

  if (isProfilePage) {
    if (!tmdbSessionID) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isLoginPage) {
    if (tmdbSessionID) {
      const redirectTo = searchParams.get("redirect_to") || "/";

      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
