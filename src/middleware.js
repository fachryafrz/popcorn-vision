import { NextResponse } from "next/server";
import { TMDB_SESSION_ID } from "./lib/constants";
import slug from "slug";

// Example of default export
export default async function middleware(request) {
  const cookiesStore = request.cookies;
  const { pathname, searchParams } = request.nextUrl;

  const isTvPage =
    pathname.startsWith("/tv") &&
    !pathname.startsWith("/tv/search") &&
    pathname !== "/tv";
  const isMoviesPage = pathname.startsWith("/movies") && pathname !== "/movies";
  const type = isTvPage ? "tv" : "movie";
  const tmdbSessionID = cookiesStore.has(TMDB_SESSION_ID);

  if (isMoviesPage || isTvPage) {
    const id = pathname.split("-")[0].split("/").pop();
    const film = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}?api_key=${process.env.API_KEY}&append_to_response=credits,videos,reviews,watch/providers,recommendations,similar,release_dates`,
    ).then((res) => res.json());
    const correctPathname = `/${!isTvPage ? `movies` : `tv`}/${id}-${slug(film.title ?? film.name)}`;

    if (pathname !== correctPathname) {
      return NextResponse.redirect(new URL(correctPathname, request.url));
    }
  }

  const isLoginPage = pathname.startsWith("/login");
  const isProfilePage = pathname.startsWith("/profile");

  if (isProfilePage && !tmdbSessionID) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPage && tmdbSessionID) {
    const redirectTo = searchParams.get("redirect_to") || "/";

    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (pathname === "/movies") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};