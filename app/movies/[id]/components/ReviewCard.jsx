/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RatingStars from "./RatingStars";

export default function ReviewCard({ review }) {
  // Read More state
  const [readMore, setReadMore] = useState(false);
  const [isDateHovered, setIsDateHovered] = useState(false);

  // Review content variables
  const text = review.content;
  const words = text.split(" ");
  const wordCount = words.length;
  const maxLength = 40;

  // Review date variables
  const dateStr = review && review.created_at;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
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
    <div className="flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl">
      <div className="flex gap-2 items-center">
        <div className="aspect-square !w-[50px] self-center rounded-full overflow-hidden bg-base-dark-gray">
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
          <span className="font-medium line-clamp-1">{review.author}</span>

          <div
            onMouseEnter={() => setIsDateHovered(true)}
            onMouseLeave={() => setIsDateHovered(false)}
            className={`max-w-fit text-xs sm:text-sm text-gray-400 flex gap-1`}
          >
            <span>
              {isDateHovered ? formattedDate : timeAgo(review.created_at)}
            </span>

            {new Date(review.updated_at).toLocaleString("en-US", options) !==
              new Date(review.created_at).toLocaleString("en-US", options) && (
              <span>
                {isDateHovered
                  ? `(${new Date(review.updated_at).toLocaleString(
                      "en-US",
                      options
                    )})`
                  : `(edited)`}
              </span>
            )}
          </div>
        </div>

        <div
          className={`ml-auto flex items-start text-primary-yellow whitespace-nowrap`}
        >
          <RatingStars rating={review.author_details.rating} />
        </div>
      </div>

      <div className={`prose max-w-none !text-gray-400`}>
        <ReactMarkdown>
          {readMore || wordCount < maxLength
            ? text
            : `${words.slice(0, maxLength).join(" ")}...`}
        </ReactMarkdown>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleReadMore}
          className={`${
            words.length > maxLength ? `flex` : `hidden`
          } text-primary-blue max-w-fit -mt-2 hocus:font-medium`}
        >
          {readMore ? `Show less` : `Read more`}
        </button>
      </div>
    </div>
  );
}
