/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Person from "../../Person/Person";
import { siteConfig } from "@/config/site";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  const createdAt = dayjs(review.created_at).format("MMM D, YYYY");
  const updatedAt = dayjs(review.updated_at).format("MMM D, YYYY");

  // Review author image URL variables
  const imgUrlAPI = review.author_details.avatar_path;
  const imgUrl =
    imgUrlAPI && imgUrlAPI.startsWith("/http")
      ? imgUrlAPI.replace(/^\//, "")
      : `https://image.tmdb.org/t/p/w500${imgUrlAPI}`;

  return (
    <div className="-mx-4 flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 md:mx-0 md:rounded-xl">
      <h3 className="sr-only">
        {`${review.author} (${review.author_details.rating ? `Rated: ${review.author_details.rating}` : `Not rated`})`}
      </h3>

      <div className="flex items-center gap-2">
        <Person
          name={review.author}
          profile_path={imgUrlAPI && imgUrl}
          role={dayjs(review.created_at).fromNow()}
          personRole={`author`}
          tooltip={
            <div
              className={`tooltip tooltip-bottom tooltip-info relative flex max-w-fit flex-wrap gap-1 text-xs font-medium text-gray-400 sm:tooltip-right before:text-xs`}
              data-tip={`${createdAt} ${updatedAt !== createdAt ? ` (${updatedAt})` : ``}`}
            >
              <span>{dayjs(review.created_at).fromNow()}</span>
              {updatedAt !== createdAt && <span>{`(edited)`}</span>}
            </div>
          }
        />

        <div
          className={`mb-auto ml-auto flex items-start whitespace-nowrap text-primary-yellow`}
        >
          <RatingStars id={review.id} rating={review.author_details.rating} />
        </div>
      </div>

      <div
        className={`prose max-w-none text-sm sm:text-base [&_*]:!text-white`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                href={`${props.href}?utm_source=${siteConfig.url.replace(/^https?:\/\//, "")}`}
                target="_blank"
              >
                {props.children}
              </a>
            ),
          }}
        >
          {readMore || wordCount < maxLength
            ? text
            : `${words.slice(0, maxLength).join("")}...`}
        </ReactMarkdown>
      </div>

      <div
        className={`${words.length > maxLength ? `flex` : `hidden`} items-center`}
      >
        <button
          onClick={() => setReadMore(!readMore)}
          className={`-mt-2 flex max-w-fit pr-1 pt-1 text-primary-blue hocus:font-medium`}
        >
          {readMore ? `Show less` : `Read more`}
        </button>
      </div>
    </div>
  );
}

function RatingStars({ id, rating }) {
  return (
    <>
      <div className="rating rating-half rating-sm">
        <input
          type="radio"
          name={`review-rating-${id}`}
          checked={!rating}
          className="rating-hidden sr-only cursor-default"
          disabled
        />
        {[...Array(10)].map((_, index) => {
          const starValue = index + 1;

          return (
            <input
              key={starValue}
              type="radio"
              name={`review-rating-${id}`}
              checked={rating === starValue}
              className={`mask mask-half-${(index % 2) + 1} mask-star-2 cursor-default bg-primary-yellow`}
              disabled
            />
          );
        })}
      </div>
    </>
  );
}
