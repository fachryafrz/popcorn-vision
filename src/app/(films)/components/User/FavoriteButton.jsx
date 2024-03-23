import { IonIcon } from "@ionic/react";
import { starOutline } from "ionicons/icons";
import React from "react";

export default function FavoriteButton() {
  return (
    <button
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
    >
      <IonIcon icon={starOutline} className={`text-xl`} />
      <span>Favorite</span>
    </button>
  );
}
