import { IonIcon } from "@ionic/react";
import { arrowRedoOutline } from "ionicons/icons";
import React from "react";

export default function ShareButton() {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Shared via ${process.env.NEXT_PUBLIC_APP_NAME}`,
        // text: "",
        url: window.location.href,
        // files: [],
      });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  return (
    <>
      {/* Mobile Share Button */}
      <button
        onClick={handleShare}
        className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm sm:hidden`}
      >
        <IonIcon icon={arrowRedoOutline} className={`text-xl`} />
        <span>Share</span>
      </button>

      {/* Desktop Share Button */}
      <button
        className={`btn btn-ghost hidden items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm sm:flex`}
        onClick={() => document.getElementById("shareModal").showModal()}
      >
        <IonIcon icon={arrowRedoOutline} className={`text-xl`} />
        <span>Share</span>
      </button>
    </>
  );
}
