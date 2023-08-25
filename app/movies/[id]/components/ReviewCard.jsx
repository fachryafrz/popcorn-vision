/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RatingStars from "./RatingStars";

export default function ReviewCard({ review }) {
  // Read More state
  const [readMore, setReadMore] = useState(false);

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
  const imgUrl = imgUrlAPI?.startsWith("/http")
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

          <span className="text-sm text-gray-400">{formattedDate}</span>
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

        {new Date(review.updated_at).toLocaleString("en-US", options) !==
          new Date(review.created_at).toLocaleString("en-US", options) && (
          <span className="text-xs text-gray-400 ml-auto">
            Updated at{" "}
            {new Date(review.updated_at).toLocaleString("en-US", options)}
          </span>
        )}
      </div>
    </div>
  );
}
