import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { usePathname } from "next/navigation";
import { getMoreReviews } from "@/lib/fetch";
import { isPlural } from "@/lib/isPlural";

export default function FilmReviews({ reviews, film }) {
  const totalReviewPages = reviews.total_pages;
  let [currentPage, setCurrentPage] = useState(1);
  const [moreReviews, setMoreReviews] = useState(reviews.results);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const numReviews = 5;

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  // useEffect(() => {
  //   setCurrentPage(1);
  //   setShowAllReviews(false);
  // }, [film]);

  return (
    <div id="reviews" className="relative flex flex-col gap-2">
      <div className="sticky top-[66px] z-10 -mx-4 flex items-center gap-1 bg-base-100 bg-opacity-[85%] px-4 py-2 backdrop-blur">
        <h2 className="m-0 text-xl font-bold text-white">
          {`${isPlural({ text: `Review`, number: moreReviews.length })} `}
          <span className={`text-sm font-normal text-gray-400`}>
            ({reviews.total_results})
          </span>
        </h2>
      </div>
      <ul className="flex flex-col gap-2">
        {moreReviews
          .slice(0, showAllReviews ? moreReviews.length : numReviews)
          .map((review) => {
            return (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            );
          })}
      </ul>

      {totalReviewPages > 1 &&
        showAllReviews &&
        currentPage !== totalReviewPages && (
          <div
            className={`flex items-center before:h-[1px] before:w-full before:bg-white before:opacity-10 after:h-[1px] after:w-full after:bg-white after:opacity-10`}
          >
            <button
              onClick={() =>
                getMoreReviews({
                  film,
                  type: !isTvPage ? `movie` : `tv`,
                  currentPage,
                }).then((data) => {
                  setCurrentPage((prevPage) => prevPage + 1);
                  setMoreReviews((prevReviews) => [
                    ...prevReviews,
                    ...data.results,
                  ]);
                })
              }
              className="btn btn-ghost w-[25%] min-w-fit rounded-full border-none bg-white bg-opacity-5 px-12 text-primary-blue"
            >
              Load more
            </button>
          </div>
        )}

      {/* View all reviews */}
      {moreReviews.length > numReviews && (
        <div
          className={`absolute inset-x-0 bottom-0 -mx-4 h-[200px] items-end justify-center bg-gradient-to-t from-base-100 text-primary-blue md:mx-0 ${
            showAllReviews ? `hidden` : `flex`
          }`}
        >
          <button onClick={handleShowAllReviews}>View all reviews</button>
        </div>
      )}
    </div>
  );
}
