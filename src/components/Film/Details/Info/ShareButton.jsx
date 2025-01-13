import { IonIcon } from "@ionic/react";
import { arrowRedoOutline } from "ionicons/icons";
import { isMobile } from "react-device-detect";

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
      {isMobile && (
        <button
          onClick={handleShare}
          className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm `}
        >
          <IonIcon
            icon={arrowRedoOutline}
            style={{
              fontSize: 20,
            }}
          />
          <span>Share</span>
        </button>
      )}

      {/* Desktop Share Button */}
      {!isMobile && (
        <button
          className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
          onClick={() => document.getElementById("shareModal").showModal()}
        >
          <IonIcon
            icon={arrowRedoOutline}
            style={{
              fontSize: 20,
            }}
          />
          <span>Share</span>
        </button>
      )}
    </>
  );
}
