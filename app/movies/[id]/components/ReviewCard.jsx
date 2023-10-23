/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RatingStars from "./RatingStars";
import { IonIcon } from "@ionic/react";
import { triangle } from "ionicons/icons";

export default function ReviewCard({ review }) {
  // Read More state
  const [readMore, setReadMore] = useState(false);
  const [isDateHovered, setIsDateHovered] = useState(false);

  // Review content variables
  const text = review.content;
  const words = text.split(" ");
  const wordCount = words.length;
  const maxLength = 30;

  // Review date variables
  const dateStr = review && review.created_at;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  // Review author image URL variables
  const imgUrlAPI = review.author_details.avatar_path;
  const imgUrl =
    imgUrlAPI && imgUrlAPI.startsWith("/http")
      ? imgUrlAPI.replace(/^\//, "")
      : `https://image.tmdb.org/t/p/w500${imgUrlAPI}`;

  // Toggle the "Read More" state
  const handleReadMore = () => {
    setReadMore(!readMore);
  };

  useEffect(() => {
    // Reset the "Read More" state when the review changes
    setReadMore(false);
  }, [review]);

  const timeAgo = (date) => {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      return (
        Math.floor(interval) + ` year${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` month${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    interval = seconds / 604800;
    if (interval > 1) {
      return (
        Math.floor(interval) + ` week${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return (
        Math.floor(interval) + ` day${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return (
        Math.floor(interval) + ` hour${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    interval = seconds / 60;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` minute${Math.floor(interval) > 1 ? `s` : ``} ago`
      );
    }
    return Math.floor(seconds) + ` second${intervalFloored > 1 ? `s` : ``} ago`;
  };

  return (
    <div
      className="flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl"
      itemProp="review"
      itemType="http://schema.org/Review"
    >
      <div className="flex gap-2 items-center">
        <div className="aspect-square !min-w-[50px] !max-w-[50px] rounded-full overflow-hidden bg-base-dark-gray">
          {imgUrlAPI === null ? (
            <figure
              style={{
                background: `url(/popcorn.png)`,
                backgroundSize: `contain`,
              }}
              className={`w-[50px] aspect-square`}
            ></figure>
          ) : (
            imgUrl && (
              <figure
                style={{
                  background: `url(${imgUrl})`,
                  backgroundSize: `cover`,
                }}
                className={`w-[50px] aspect-square`}
              ></figure>
            )
          )}
        </div>
        <div className="flex flex-col justify-center max-w-[45vw]">
          <div itemProp="author" itemScope itemType="http://schema.org/Person">
            <span
              title={review.author}
              className="font-medium line-clamp-1"
              itemProp="name"
            >
              {review.author}
            </span>
          </div>

          <div
            onMouseEnter={() => setIsDateHovered(true)}
            onMouseLeave={() => setIsDateHovered(false)}
            className={`max-w-fit text-xs sm:text-sm text-gray-400 flex flex-wrap gap-1 relative`}
          >
            <span>{timeAgo(review.created_at)}</span>
            {new Date(review.updated_at).toLocaleString("en-US", options) !==
              new Date(review.created_at).toLocaleString("en-US", options) && (
              <span>{`(edited)`}</span>
            )}
            <span
              className={`absolute top-full md:left-full left-1/2 -translate-x-1/2 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 text-xs bg-base-dark-gray p-2 mt-3 md:mt-0 md:ml-3 rounded-lg whitespace-nowrap w-fit text-center transition-all duration-500 ${
                isDateHovered
                  ? `opacity-100 pointer-events-auto`
                  : `opacity-0 pointer-events-none`
              }`}
            >
              {formattedDate}{" "}
              {new Date(review.updated_at).toLocaleString("en-US", options) !==
                new Date(review.created_at).toLocaleString("en-US", options) &&
                `(${new Date(review.updated_at).toLocaleString(
                  "en-US",
                  options
                )})`}
              <IonIcon
                icon={triangle}
                className={`absolute -top-[0.6rem] md:-left-[0.6rem] left-1/2 -translate-x-1/2 md:-translate-x-0 md:top-1/2 md:-translate-y-1/2 md:-rotate-90 text-base-dark-gray`}
              />
            </span>
          </div>
        </div>

        <div
          className={`ml-auto flex items-start text-primary-yellow whitespace-nowrap mb-auto`}
        >
          <RatingStars rating={review.author_details.rating} />
        </div>
      </div>

      <div className={`prose max-w-none !text-gray-400`} itemProp="reviewBody">
        <ReactMarkdown>
          {readMore || wordCount < maxLength
            ? text
            : `${words.slice(0, maxLength).join(" ")}...`}
        </ReactMarkdown>
      </div>

      <div
        className={`${
          words.length > maxLength ? `flex` : `hidden`
        } items-center`}
      >
        <button
          onClick={handleReadMore}
          className={`flex text-primary-blue max-w-fit -mt-2 hocus:font-medium`}
        >
          {readMore ? `Show less` : `Read more`}
        </button>
      </div>
    </div>
  );
}
