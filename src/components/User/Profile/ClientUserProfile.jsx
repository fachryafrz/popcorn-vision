"use client";

import React from "react";
import useSWR from "swr";
import User from "@/components/User/Profile/User";
import TileList from "@/components/User/Profile/TileList";
import UserProfileSort from "@/components/User/Profile/Sort";
import { axios } from "@/lib/axios";

export default function ClientUserProfile() {
  const { data: user, error, isLoading } = useSWR(
    `/api/account`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <section className={`py-4 min-h-screen flex items-center justify-center`}>
         <span className="loading loading-spinner loading-lg text-primary"></span>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className={`py-4 min-h-screen flex items-center justify-center`}>
         <p className="text-red-500">Failed to load user profile.</p>
      </section>
    );
  }

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
