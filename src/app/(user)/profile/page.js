import React from "react";
import User from "../../../components/User/Profile/User";
import axios from "axios";
import { cookies } from "next/headers";
import { fetchData } from "@/lib/fetch";
import TileList from "../../../components/User/Profile/TileList";
import UserProfileSort from "@/components/User/Profile/Sort";
import { POPCORN, POPCORN_APPLE, TMDB_SESSION_ID } from "@/lib/constants";

export const revalidate = 0;

export async function generateMetadata() {
  const cookiesStore = cookies();

  const { data: user } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/account`,
    {
      params: {
        api_key: process.env.API_KEY,
        session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      },
    },
  );

  return {
    title: user.name,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_APP_URL,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: process.env.NEXT_PUBLIC_APP_URL,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: POPCORN,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      creator: "@fachryafrz",
      images: POPCORN,
    },
    icons: {
      icon: POPCORN,
      shortcut: POPCORN,
      apple: POPCORN_APPLE,
    },
  };
}

export default async function page() {
  const cookiesStore = cookies();

  const { data: user } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/account`,
    {
      params: {
        api_key: process.env.API_KEY,
        session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      },
    },
  );

  const favoriteMovies = await fetchData({
    endpoint: `/account/${user.id}/favorite/movies`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });
  const watchlistMovies = await fetchData({
    endpoint: `/account/${user.id}/watchlist/movies`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });
  const ratedMovies = await fetchData({
    endpoint: `/account/${user.id}/rated/movies`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });

  const favoriteTv = await fetchData({
    endpoint: `/account/${user.id}/favorite/tv`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });
  const watchlistTv = await fetchData({
    endpoint: `/account/${user.id}/watchlist/tv`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });
  const ratedTv = await fetchData({
    endpoint: `/account/${user.id}/rated/tv`,
    queryParams: {
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
      sort_by: "created_at.desc",
    },
  });

  // const fetchFilmsData = async ({ type = "movie", section, films }) => {
  //   const data = await Promise.all(
  //     films.results.map(async (item) => {
  //       const filmData = await fetchData({
  //         endpoint: `/account/${user.id}/${section}/${type === "movie" ? "movies" : "tv"}`,
  //         queryParams: {
  //           session_id: cookiesStore.get(TMDB_SESSION_ID).value,
  //           sort_by: "created_at.desc",
  //         },
  //       });

  //       return filmData;
  //     }),
  //   );

  //   return data;
  // };

  return (
    <section className={`py-4`}>
      <User user={user} />

      <div className={`flex flex-col`}>
        <div className={`flex items-center justify-end px-4 pt-4`}>
          <UserProfileSort />
        </div>

        <div
          className={`grid gap-2 p-4 md:grid-cols-2 xl:grid-cols-3 [&_section_ul]:max-h-[500px] [&_section_ul]:overflow-y-auto`}
        >
          {/* Movies */}
          <TileList
            title={`Favorite (Movie)`}
            section={`favorite`}
            films={favoriteMovies}
            user={user}
          />
          <TileList
            title={`Watchlist (Movie)`}
            section={`watchlist`}
            films={watchlistMovies}
            user={user}
          />
          <TileList
            title={`Rated (Movie)`}
            section={`rated`}
            films={ratedMovies}
            user={user}
          />

          {/* TV Shows */}
          <TileList
            title={`Favorite (TV Shows)`}
            section={`favorite`}
            films={favoriteTv}
            type={`tv`}
            user={user}
          />
          <TileList
            title={`Watchlist (TV Shows)`}
            section={`watchlist`}
            films={watchlistTv}
            type={`tv`}
            user={user}
          />
          <TileList
            title={`Rated (TV Shows)`}
            section={`rated`}
            films={ratedTv}
            type={`tv`}
            user={user}
            className={`md:col-span-2 xl:col-span-1`}
          />
        </div>
      </div>
    </section>
  );
}
