import React, { useEffect, useRef, useState } from "react";
import { Loading } from "./Loading";
import ReactMarkdown from "react-markdown";
import RatingStars from "./RatingStars";

export default function FilmReviews({ logo, review, loading }) {
  const [readMore, setReadMore] = useState(false);
  const text = review.content;
  const words = text.split(" ");
  const wordCount = words.length;
  const maxLength = 50;

  const dateStr = review && review.created_at;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  const imgUrlAPI = review.author_details.avatar_path;
  const imgUrl = imgUrlAPI?.startsWith("/http")
    ? imgUrlAPI.replace(/^\//, "")
    : `${import.meta.env.VITE_API_IMAGE_URL_500}${imgUrlAPI}`;

  const handleReadMore = () => {
    setReadMore(!readMore);
  };

  useEffect(() => {
    setReadMore(false);
  }, [review]);

  return (
    <div
      id="reviewsCard"
      className="flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl"
    >
      <div className="flex gap-2 items-center">
        <figure className="aspect-square !w-[50px] self-center rounded-full overflow-hidden">
          <div
            className={`relative ${
              imgUrlAPI === null ? `w-full h-full bg-base-dark-gray` : `hidden`
            }`}
          >
            {loading ? (
              <Loading classNames={`!h-[50px] !w-[50px] -m-2`} />
            ) : (
              <img
                loading="lazy"
                src={logo}
                alt={import.meta.env.VITE_APP_NAME}
                className={`object-contain`}
              />
            )}
          </div>
          {loading ? <Loading /> : false}
          {imgUrl && (
            <img loading="lazy" src={`${imgUrl}`} alt={review.author} />
          )}
        </figure>
        <div className="flex flex-col justify-center max-w-[45vw]">
          {loading ? (
            <Loading height="[20px] !w-[70px]" className={`h-[20px]`} />
          ) : (
            <span className="font-medium line-clamp-1">{review.author}</span>
          )}
          {loading ? (
            <Loading height="[10px] mt-1 !w-[100px]" className={`h-[10px]`} />
          ) : (
            <span className="text-sm text-gray-400">{formattedDate}</span>
          )}
        </div>
        {!loading && (
          <div
            className={`ml-auto flex items-start text-primary-yellow whitespace-nowrap`}
          >
            <RatingStars rating={review.author_details.rating} />
          </div>
        )}
      </div>
      {loading ? (
        <Loading classNames={`!h-[150px]`} />
      ) : (
        <div className={`prose max-w-none !text-gray-400`}>
          <ReactMarkdown
            children={
              readMore || wordCount < maxLength
                ? text
                : `${words.slice(0, maxLength).join(" ")}...`
            }
          />
        </div>
      )}
      {!loading && (
        <div className="flex items-center">
          <button
            onClick={handleReadMore}
            className={`${
              words.length > maxLength ? `flex` : `hidden`
            } text-primary-blue max-w-fit -mt-2 hover:font-medium`}
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
      )}
    </div>
  );
}
