// React
import React from "react";

// Ionicons Icons
import { IonIcon } from "@ionic/react";
import { star, starHalf, starOutline } from "ionicons/icons";

const RatingStars = ({ rating }) => {
  const maxRating = 10; // Maximum rating value
  const fullStarCount = Math.floor(rating / 2); // Number of full stars
  const hasHalfStar = rating % 2 !== 0; // Indicates if there is a half star

  if (rating < 1) {
    return <div className="text-sm italic">Not rated</div>;
  }

  const renderStars = () => {
    const stars = [];

    // Render full stars
    for (let i = 0; i < fullStarCount; i++) {
      stars.push(<IonIcon key={i} icon={star} />);
    }

    // Render half star if available
    if (hasHalfStar) {
      stars.push(<IonIcon key={fullStarCount} icon={starHalf} />);
    }

    // Render empty stars if rating has not reached the maximum
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

  return (
    <div>
      {renderStars()}

      <div
        className="sr-only"
        itemProp="reviewRating"
        itemScope
        itemType="http://schema.org/Rating"
      >
        <meta itemProp="worstRating" content="1" />
        <span itemProp="ratingValue">{`${rating}`}</span>/
        <span itemProp="bestRating">10</span>
      </div>
    </div>
  );
};

export default RatingStars;
