/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import RatingStars from "./RatingStars";
import Person from "../../Person/Person";
import moment from "moment";

export default function ReviewCard({ review }) {
  // Read More state
  const [readMore, setReadMore] = useState(false);
  const [isDateHovered, setIsDateHovered] = useState(false);

  // Review content variables
  const text = review.content;
  const words = text.split("");
  const wordCount = words.length;
  const maxLength = 300;

  // Review date variables
  const createdAt = moment(review.created_at).format("MMM D, YYYY");
  const updatedAt = moment(review.updated_at).format("MMM D, YYYY");

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

  return (
    <div className="-mx-4 flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 md:mx-0 md:rounded-xl">
      <div className="flex items-center gap-2">
        <Person
          name={review.author}
          profile_path={imgUrlAPI === null ? null : imgUrl}
          role={moment(review.created_at).fromNow()}
          personRole={`author`}
          tooltip={
            <div
              className={`tooltip tooltip-bottom tooltip-info relative flex max-w-fit flex-wrap gap-1 text-xs font-medium text-gray-400 sm:tooltip-right before:text-xs`}
              data-tip={`${createdAt} ${updatedAt !== createdAt ? ` (${updatedAt})` : ``}`}
            >
              <span>{moment(review.created_at).fromNow()}</span>
              {updatedAt !== createdAt && <span>{`(edited)`}</span>}
            </div>
          }
        />

        <div
          className={`mb-auto ml-auto flex items-start whitespace-nowrap text-primary-yellow`}
        >
          <RatingStars rating={review.author_details.rating} />
        </div>
      </div>

      <div
        className={`prose max-w-none text-sm sm:text-base [&_*]:!text-white`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {readMore || wordCount < maxLength
            ? text
            : `${words.slice(0, maxLength).join("")}...`}
        </ReactMarkdown>
      </div>

      <div
        className={`${words.length > maxLength ? `flex` : `hidden`} ${
          readMore ? `sticky bottom-0` : ``
        } items-center`}
      >
        <button
          onClick={handleReadMore}
          className={`-mt-2 flex max-w-fit pr-1 pt-1 text-primary-blue hocus:font-medium`}
        >
          {readMore ? `Show less` : `Read more`}
        </button>
      </div>
    </div>
  );
}
