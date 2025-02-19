"use client";

import { userStore } from "@/zustand/userStore";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export default function WatchlistButton({
  swrKey,
  film,
  watchlist,
  withText = true,
  className,
}) {
  const { user } = userStore();
  const { mutate } = useSWRConfig();

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchlist = async (value) => {
    try {
      setIsLoading(true);

      const {
        data: { watchlist },
      } = await axios.post(`/api/account/${user.id}/watchlist`, {
        media_type: !isTvPage ? "movie" : "tv",
        media_id: film.id,
        watchlist: value,
      });
      setIsLoading(false);
      setIsAdded(watchlist);

      mutate(swrKey);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setIsLoading(false);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  useEffect(() => {
    setIsAdded(watchlist);
  }, [watchlist]);

  return (
    <button
      onClick={() => {
        if (user) {
          handleWatchlist(!isAdded);
        } else {
          document.getElementById("loginAlert").showModal();
        }
      }}
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm ${className}`}
    >
      {isLoading ? (
        <span className="loading loading-spinner w-[20px]"></span>
      ) : (
        <IonIcon
          icon={!isAdded ? bookmarkOutline : bookmark}
          style={{
            fontSize: 20,
          }}
        />
      )}
      {/* <span>{!isAdded ? "Add to Watchlist" : "Remove from Watchlist"}</span> */}
      {withText && <span>Watchlist</span>}
    </button>
  );
}
