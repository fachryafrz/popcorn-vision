import React from "react";
import User from "../../../components/User/Profile/User";
import axios from "axios";
import { cookies } from "next/headers";
import TileList from "../../../components/User/Profile/TileList";
import UserProfileSort from "@/components/User/Profile/Sort";
import { POPCORN, POPCORN_APPLE, TMDB_SESSION_ID } from "@/lib/constants";
import { siteConfig } from "@/config/site";

export const revalidate = 0;

export async function generateMetadata() {
  const cookiesStore = cookies();

  const { data: user } = await axios.get(`${process.env.API_URL}/account`, {
    params: {
      api_key: process.env.API_KEY,
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
    },
  });

  return {
    title: user.name ?? user.username,
    openGraph: {
      title: `${user.name ?? user.username} - ${siteConfig.name}`,
      url: `${siteConfig.url}/profile`,
    },
  };
}

export default async function page() {
  const cookiesStore = cookies();

  const { data: user } = await axios.get(`${process.env.API_URL}/account`, {
    params: {
      api_key: process.env.API_KEY,
      session_id: cookiesStore.get(TMDB_SESSION_ID).value,
    },
  });

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
          <TileList title={`Favorite`} section={`favorite`} user={user} />
          <TileList title={`Watchlist`} section={`watchlist`} user={user} />
          <TileList title={`Rated`} section={`rated`} user={user} />
        </div>
      </div>
    </section>
  );
}
