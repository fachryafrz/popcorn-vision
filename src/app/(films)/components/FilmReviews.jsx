import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { usePathname } from "next/navigation";
import { getMoreReviews } from "@/lib/fetch";

export default function FilmReviews({ reviews, film }) {
  const totalReviewPages = reviews.total_pages;
  let [currentPage, setCurrentPage] = useState(1);
  const [moreReviews, setMoreReviews] = useState(reviews.results);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const numReviews = 2;

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  useEffect(() => {
    setCurrentPage(1);
    setShowAllReviews(false);
  }, [film]);

  return (
    <div id="reviews" className="flex flex-col gap-2 relative">
      <div className="flex gap-1 items-center bg-base-100 backdrop-blur bg-opacity-[85%] sticky top-[66px] py-2 z-10">
        <h2 className="font-bold text-xl text-white m-0">
          {moreReviews.length > 1 ? `Reviews` : `Review`}
        </h2>{" "}
        <span className={`text-sm text-gray-400`}>
          ({reviews.total_results})
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {moreReviews
          .slice(0, showAllReviews ? moreReviews.length : numReviews)
          .map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })}
      </div>

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
              className="btn btn-ghost bg-white text-primary-blue rounded-full px-12 min-w-fit w-[25%] bg-opacity-5 border-none"
            >
              Load more
            </button>
          </div>
        )}

      {/* View all reviews */}
      {moreReviews.length > numReviews && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-100 justify-center items-end h-[200px] text-primary-blue ${
            showAllReviews ? `hidden` : `flex`
          }`}
        >
          <button onClick={handleShowAllReviews}>View all reviews</button>
        </div>
      )}
    </div>
  );
}
