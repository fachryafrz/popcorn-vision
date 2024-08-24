"use client";

import { useAuth } from "@/hooks/auth";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { useCookies } from "next-client-cookies";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function WatchlistButton({ film, watchlist }) {
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );

  const [isAdded, setIsAdded] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchlist = useCallback(
    async (value) => {
      try {
        setIsLoading(true);

        const {
          data: { watchlist },
        } = await axios.post(`/api/account/watchlist`, {
          user_id: user.id,
          media_type: !isTvPage ? "movie" : "tv",
          media_id: film.id,
          watchlist: value,
        });
        setIsLoading(false);
        setIsAdded(watchlist);

        if (!searchParams.get("approved") || !searchParams.get("denied")) {
          current.delete("watchlist");
          router.replace(`${pathname}?${current.toString()}`, {
            scroll: false,
          });
        }
      } catch (error) {
        console.error("Error adding to watchlist:", error);
        setIsLoading(false);
        // Handle errors appropriately (e.g., display error message to user)
      }
    },
    [current, film, isTvPage, pathname, router, searchParams, user],
  );

  useEffect(() => {
    setIsAdded(watchlist);
  }, [watchlist]);

  useEffect(() => {
    if (searchParams.get("watchlist")) {
      handleWatchlist(searchParams.get("watchlist"));
    }
  }, [handleWatchlist, searchParams]);

  return (
    <button
      onClick={() => {
        if (user) {
          handleWatchlist(!isAdded);
        } else {
          router.replace(`${pathname}?watchlist=true`, { scroll: false });
          document.getElementById("loginAlert").showModal();
        }
      }}
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
    >
      {isLoading ? (
        <span class="loading loading-spinner w-[20px]"></span>
      ) : (
        <IonIcon
          icon={!isAdded ? bookmarkOutline : bookmark}
          className={`text-xl`}
        />
      )}
      {/* <span>{!isAdded ? "Add to Watchlist" : "Remove from Watchlist"}</span> */}
      <span>Watchlist</span>
    </button>
  );
}
