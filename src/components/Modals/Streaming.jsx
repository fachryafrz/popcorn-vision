"use client";

import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Streaming() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const streaming = searchParams.get("streaming");

  const [origin, type, id] = pathname.split("/");

  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

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
            src={
              type === "movies"
                ? `https://vidbinge.dev/embed/movie/${id?.split("-")[0]}`
                : `https://vidbinge.dev/embed/tv/${id?.split("-")[0]}/${season ?? 1}/${episode ?? 1}`
            }
          ></iframe>
        )}
      </div>

      {/* Close */}
      <form
        method="dialog"
        onSubmit={() => router.back()}
        className={`absolute right-4 top-4 z-50`}
      >
        <button type="submit" className={`flex`}>
          <IonIcon icon={close} style={{ fontSize: 30 }} />
        </button>
      </form>
    </dialog>
  );
}
