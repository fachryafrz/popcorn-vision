import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";

export default function FilmReviews({ reviews, film }) {
  const totalReviewPages = reviews.total_pages;
  let [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [moreReviews, setMoreReviews] = useState(reviews.results);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const numReviews = 2;

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const fetchMoreReviews = async () => {
    setCurrentReviewPage((prevPage) => prevPage + 1);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/movie/${film.id}/reviews`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_API_KEY,
            page: currentReviewPage,
          },
        }
      );
      setMoreReviews((prevReviews) => [...prevReviews, ...res.data.results]);
    } catch (error) {
      console.error(`Errornya reviews kedua: ${error}`);
    }
  };

  useEffect(() => {
    setCurrentReviewPage(1);
    setShowAllReviews(false);
  }, [film]);

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex gap-4 items-center justify-between bg-base-100 backdrop-blur bg-opacity-[85%] sticky top-[4.125rem] py-2 z-10">
        <h2 className="font-bold text-xl text-white m-0">
          {moreReviews.length > 1 ? `Reviews` : `Review`}
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {moreReviews
          .slice(0, showAllReviews ? moreReviews.length : numReviews)
          .map((review, index) => {
            return <ReviewCard key={index} review={review} />;
          })}
      </div>

      {totalReviewPages > 1 &&
        showAllReviews &&
        currentReviewPage !== totalReviewPages && (
          <div
            className={`flex items-center before:h-[1px] before:w-full before:bg-white before:opacity-10 after:h-[1px] after:w-full after:bg-white after:opacity-10`}
          >
            {/* <button
              onClick={() => fetchMoreReviews((currentReviewPage += 1))}
              className="text-primary-blue p-2 px-12 xl:px-24 flex justify-center bg-white bg-opacity-5 hocus:bg-opacity-10 rounded-full whitespace-nowrap"
            >
              Load more
            </button> */}
            <button
                  onClick={() => fetchMoreReviews((currentReviewPage += 1))}
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
