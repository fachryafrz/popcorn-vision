/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import RatingStars from "./RatingStars";
import { IonIcon } from "@ionic/react";
import { triangle } from "ionicons/icons";
import Person from "./Person";
import { formatDate } from "@/app/lib/formatDate";
import { isPlural } from "@/app/lib/isPlural";

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
  const createdAt = formatDate({ date: review.created_at, showDay: false });
  const updatedAt = formatDate({ date: review.updated_at, showDay: false });

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
        Math.floor(interval) +
        ` ${isPlural({ text: "year", number: Math.floor(interval) })} ago`
      );
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` ${isPlural({ text: "month", number: Math.floor(interval) })} ago`
      );
    }
    interval = seconds / 604800;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` ${isPlural({ text: "week", number: Math.floor(interval) })} ago`
      );
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` ${isPlural({ text: "day", number: Math.floor(interval) })} ago`
      );
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` ${isPlural({ text: "hour", number: Math.floor(interval) })} ago`
      );
    }
    interval = seconds / 60;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        ` ${isPlural({ text: "minute", number: Math.floor(interval) })} ago`
      );
    }
    return (
      Math.floor(seconds) +
      ` ${isPlural({ text: "second", number: Math.floor(interval) })} ago`
    );
  };

  return (
    <div
      className="flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl"
      itemProp="review"
      itemScope
      itemType="http://schema.org/Review"
    >
      <div className="flex gap-2 items-center">
        <Person
          name={review.author}
          profile_path={imgUrlAPI === null ? null : imgUrl}
          itemProp={`author`}
          role={timeAgo(review.created_at)}
          tooltip={
            <div
              className={`tooltip tooltip-bottom sm:tooltip-right tooltip-info max-w-fit text-xs font-medium text-gray-400 flex flex-wrap gap-1 relative`}
              data-tip={`${formatDate({
                date: review?.created_at,
                showDay: false,
              })} ${updatedAt !== createdAt ? `(${updatedAt})` : ``}`}
            >
              <span>{timeAgo(review.created_at)}</span>
              {updatedAt !== createdAt && <span>{`(edited)`}</span>}
            </div>
          }
        />

        <div
          className={`ml-auto flex items-start text-primary-yellow whitespace-nowrap mb-auto`}
        >
          <RatingStars rating={review.author_details.rating} />
        </div>
      </div>

      <div
        className={`prose max-w-none [&_*]:!text-white text-sm sm:text-base`}
        itemProp="reviewBody"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
