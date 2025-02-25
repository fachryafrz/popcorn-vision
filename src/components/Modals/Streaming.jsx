"use client";

import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Streaming() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const streaming = searchParams.get("streaming");

  const [origin, type, id] = pathname.split("/");

  const mediaType = type === "movies" ? "movie" : "tv";
  const filmID = id?.split("-")[0];

  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  const handleClose = () => {
    current.delete("streaming");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!streaming) {
      document.getElementById("streaming").close();
    } else {
      document.getElementById("streaming").showModal();
    }
  }, [streaming]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://vidlink.pro") return;

      if (event.data?.type === "MEDIA_DATA") {
        const mediaData = event.data.data;
        localStorage.setItem("watch-history", JSON.stringify(mediaData));
      }
    });
  }, []);

  return (
    <dialog
      id="streaming"
      onCancel={(e) => e.preventDefault()}
      className="modal gap-4 overflow-y-auto px-4 backdrop:bg-black backdrop:bg-opacity-90 backdrop:backdrop-blur lg:px-16"
    >
      {/* Screen */}
      <div className="z-0 aspect-video max-h-full w-full">
        {streaming === "true" && (
          <iframe
            width={"100%"}
            height={"100%"}
            allowFullScreen={true}
            src={`https://vidlink.pro/${mediaType}/${type === "movies" ? filmID : `${filmID}/${season || 1}/${episode || 1}`}?primaryColor=0278fd&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=false&autoplay=true&nextbutton=true`}
          ></iframe>
        )}
      </div>

      {/* Close */}
      <form
        method="dialog"
        onSubmit={handleClose}
        className={`absolute right-4 top-4 z-50`}
      >
        <button type="submit" className={`flex`}>
          <IonIcon icon={close} style={{ fontSize: 30 }} />
        </button>
      </form>
    </dialog>
  );
}
