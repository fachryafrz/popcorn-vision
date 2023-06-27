import React from "react";
import { IonIcon } from "@ionic/react";
import { star, starHalf, starOutline } from "ionicons/icons";

const RatingStars = ({ rating }) => {
  const maxRating = 10; // Jumlah maksimal rating
  const fullStarCount = Math.floor(rating / 2); // Jumlah bintang penuh
  const hasHalfStar = rating % 2 !== 0; // Apakah ada setengah bintang

  if (rating < 1) {
    return <div className="text-sm">Not rated</div>;
  }

  const renderStars = () => {
    const stars = [];

    // Render bintang penuh
    for (let i = 0; i < fullStarCount; i++) {
      stars.push(<IonIcon key={i} icon={star} />);
    }

    // Render setengah bintang jika ada
    if (hasHalfStar) {
      stars.push(<IonIcon key={fullStarCount} icon={starHalf} />);
    }

    // Render bintang kosong jika rating belum mencapai maksimum
    const remainingStars = 5 - Math.ceil(rating / 2);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IonIcon
          key={fullStarCount + (hasHalfStar ? 1 : 0) + i}
          icon={starOutline}
        />
      );
    }

    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default RatingStars;
