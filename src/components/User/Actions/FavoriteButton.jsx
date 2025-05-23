"use client";

import { userStore } from "@/zustand/userStore";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { star, starOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export default function FavoriteButton({
  swrKey,
  film,
  favorite,
  withText = true,
  className,
}) {
  const { user } = userStore();
  const { mutate } = useSWRConfig();

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState(favorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async (value) => {
    try {
      setIsLoading(true);

      const {
        data: { favorite },
      } = await axios.post(`/api/account/${user.id}/favorite`, {
        media_type: !isTvPage ? "movie" : "tv",
        media_id: film.id,
        favorite: value,
      });

      setIsLoading(false);
      setIsAdded(favorite);

      mutate(swrKey);
    } catch (error) {
      console.error("Error adding to favorite:", error);
      setIsLoading(false);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  useEffect(() => {
    setIsAdded(favorite);
  }, [favorite]);

  return (
    <button
      onClick={() => {
        if (user) {
          handleFavorite(!isAdded);
        } else {
          document.getElementById("loginAlert").showModal();
        }
      }}
      className={`btn btn-ghost flex w-fit items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm ${className}`}
    >
      {isLoading ? (
        <span className="loading loading-spinner w-[20px]"></span>
      ) : (
        <IonIcon
          icon={!isAdded ? starOutline : star}
          className={`${isAdded ? `!text-primary-yellow` : ``}`}
          style={{
            fontSize: 20,
          }}
        />
      )}
      {withText && <span>Favorite</span>}
    </button>
  );
}
