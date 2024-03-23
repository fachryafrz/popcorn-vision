"use client";

import { useAuth } from "@/hooks/auth";
import { QueryData, fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import { useCookies } from "next-client-cookies";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function FavoriteButton({ film }) {
  const { user } = useAuth();
  const cookies = useCookies();
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState(false);

  const getFavorites = useCallback(async () => {
    try {
      const res = await fetchData({
        endpoint: `/account/${user.id}/favorite/movies`,
        queryParams: {
          language: "en",
          page: 1,
          session_id: cookies.get("tmdb.session_id"),
          sort_by: "created_at.desc",
        },
      });

      const { total_pages } = res;

      if (total_pages > 1) {
        await Promise.all(
          Array.from({ length: total_pages }).map(async (_, index) => {
            const nextPage = index + 1;

            const data = await fetchData({
              endpoint: `/account/${user.id}/favorite/movies`,
              queryParams: {
                language: "en",
                page: nextPage,
                session_id: cookies.get("tmdb.session_id"),
                sort_by: "created_at.desc",
              },
            });

            res.results.push(...data.results);
          }),
        );
      }

      const favorites = res.results;

      if (favorites.some((fav) => fav.id === film.id)) {
        setIsAdded(true);
      } else {
        setIsAdded(false);
      }
    } catch (error) {}
  }, [cookies, film.id, user.id]);

  const handleFavorite = async (favorite) => {
    try {
      await QueryData({
        endpoint: `/account/${user.id}/favorite`,
        queryParams: {
          session_id: cookies.get("tmdb.session_id"),
        },
        data: {
          media_type: isTvPage ? "tv" : "movie",
          media_id: film.id,
          favorite: favorite,
        },
      });
    } catch (error) {
      console.error("Error adding to favorite:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }

    await getFavorites();
  };

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  return (
    <button
      onClick={() => handleFavorite(!isAdded)}
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
    >
      <IonIcon
        icon={!isAdded ? starOutline : star}
        className={`text-xl ${isAdded ? `!text-yellow-500` : ``}`}
      />
      <span>Favorite</span>
    </button>
  );
}
