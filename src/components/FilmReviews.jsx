import React, { useEffect, useRef, useState } from "react";
import { Loading } from "./Loading";
import ReactMarkdown from "react-markdown";

export default function FilmReviews({ logo, review, loading }) {
  const [readMore, setReadMore] = useState(false);
  const reviewContent = useRef();

  const dateStr = review && review.updated_at;
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
    : `https://image.tmdb.org/t/p/w500${imgUrlAPI}`;

  const handleReadMore = () => {
    setReadMore(!readMore);
  };

  useEffect(() => {
    setReadMore(false);
  }, []);

  return (
    <div
      id="reviewsCard"
      className="flex flex-col gap-2 bg-gray-400 bg-opacity-10 p-4 rounded-xl"
    >
      <div className="flex gap-2 items-center">
        <figure className="aspect-square w-[50px] self-center rounded-full overflow-hidden">
          <div
            className={`relative ${
              imgUrlAPI === null
                ? `w-full h-full bg-base-dark-gray p-2`
                : `hidden`
            }`}
          >
            <img
              loading="lazy"
              src={logo}
              alt={import.meta.env.VITE_APP_NAME}
            />
          </div>
          {loading ? <Loading /> : false}
          {imgUrl && (
            <img loading="lazy" src={`${imgUrl}`} alt={review.author} />
          )}
        </figure>
        <div className="flex flex-col justify-start h-[50px]">
          {loading ? (
            <Loading height="[20px] !w-[70px]" className={`h-[20px]`} />
          ) : (
            <span className="font-medium">{review.author}</span>
          )}
          {loading ? (
            <Loading height="[10px] mt-1 !w-[100px]" className={`h-[10px]`} />
          ) : (
            <span className="text-sm text-gray-400">{formattedDate}</span>
          )}
        </div>
      </div>
      <div
        ref={reviewContent}
        className={`${
          readMore ? `` : `line-clamp-3`
        } prose max-w-none !text-gray-400`}
      >
        {loading ? (
          <Loading height="[150px]" className={`h-[150px]`} />
        ) : (
          <ReactMarkdown children={review.content} />
        )}
      </div>
      {!loading && (
        <button
          onClick={handleReadMore}
          className={`${
            reviewContent.current && reviewContent.current.clientHeight < 84
              ? `hidden`
              : `flex`
          } text-primary-blue max-w-fit -mt-2 hover:font-medium`}
        >
          {readMore ? `Show less` : `Read more`}
        </button>
      )}
    </div>
  );
}
