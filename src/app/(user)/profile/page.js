import React from "react";
import User from "./components/User";
import axios from "axios";
import { cookies } from "next/headers";
import { fetchData } from "@/lib/fetch";
import TileList from "./components/TileList";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const cookiesStore = cookies();

  const { data: user } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/account`,
    {
      params: {
        api_key: process.env.API_KEY,
        session_id: cookiesStore.get("tmdb.session_id").value,
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
      images: "/popcorn.png",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      creator: "@fachryafrz",
      images: "/popcorn.png",
    },
    icons: {
      icon: "/popcorn.png",
      shortcut: "/popcorn.png",
      apple: "/apple-touch-icon.png",
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
        session_id: cookiesStore.get("tmdb.session_id").value,
      },
    },
  );

  const favoriteMovies = await fetchData({
    endpoint: `/account/${user.id}/favorite/movies`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });
  const watchlistMovies = await fetchData({
    endpoint: `/account/${user.id}/watchlist/movies`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });
  const ratedMovies = await fetchData({
    endpoint: `/account/${user.id}/rated/movies`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });

  const favoriteTv = await fetchData({
    endpoint: `/account/${user.id}/favorite/tv`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });
  const watchlistTv = await fetchData({
    endpoint: `/account/${user.id}/watchlist/tv`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });
  const ratedTv = await fetchData({
    endpoint: `/account/${user.id}/rated/tv`,
    queryParams: {
      session_id: cookiesStore.get("tmdb.session_id").value,
      sort_by: "created_at.desc",
    },
  });

  return (
    <>
      <User user={user} />

      <div
        className={`flex flex-col gap-2 p-4 [&_section_ul]:max-h-[500px] [&_section_ul]:overflow-y-auto`}
      >
        {/* Movies */}
        <div
          className={`grid gap-2 rounded-2xl bg-gray-400 bg-opacity-5 p-4 md:grid-cols-2 xl:grid-cols-3`}
        >
          <TileList title={`Favorite`} films={favoriteMovies} user={user} />
          <TileList title={`Watchlist`} films={watchlistMovies} user={user} />
          <TileList
            title={`Rated`}
            films={ratedMovies}
            user={user}
            className={`md:col-span-2 xl:col-span-1`}
          />
        </div>

        {/* TV Series */}
        <div
          className={`grid gap-2 rounded-2xl bg-gray-400 bg-opacity-5 p-4 md:grid-cols-2 xl:grid-cols-3`}
        >
          <TileList
            title={`Favorite`}
            films={favoriteTv}
            type={`tv`}
            user={user}
          />
          <TileList
            title={`Watchlist`}
            films={watchlistTv}
            type={`tv`}
            user={user}
          />
          <TileList
            title={`Rated`}
            films={ratedTv}
            type={`tv`}
            user={user}
            className={`md:col-span-2 xl:col-span-1`}
          />
        </div>
      </div>
    </>
  );
}
