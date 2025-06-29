import { siteConfig } from "@/config/site";
import { IonIcon } from "@ionic/react";
import { arrowRedoOutline } from "ionicons/icons";
import { isMobile } from "react-device-detect";

export default function ShareButton() {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Shared via ${siteConfig.name}`,
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
        onClick={() =>
          isMobile
            ? handleShare()
            : document.getElementById("shareModal").showModal()
        }
        className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
      >
        <IonIcon
          icon={arrowRedoOutline}
          style={{
            fontSize: 20,
          }}
        />
        <span>Share</span>
      </button>
    </>
  );
}
