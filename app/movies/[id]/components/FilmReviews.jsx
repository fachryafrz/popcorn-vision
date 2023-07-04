import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";

export default function FilmReviews({ reviews, film }) {
  const totalReviewPages = reviews.total_pages;
  let [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [moreReviews, setMoreReviews] = useState(reviews.results);

  const fetchMoreReviews = async () => {
    setCurrentReviewPage((prevPage) => prevPage + 1);

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${film.id}/reviews`,
        {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            page: currentReviewPage,
          },
        }
      );
      setMoreReviews((prevReviews) => [...prevReviews, ...res.data.results]);
    } catch (error) {
      console.error(`Errornya reviews kedua: ${error}`);
    } finally {
      console.log(currentReviewPage);
    }
  };

  useEffect(() => {
    setCurrentReviewPage(1);
  }, [film]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center justify-between bg-base-dark-gray backdrop-blur bg-opacity-[85%] sticky top-[4.125rem] py-2 z-10">
        <h2 className="font-bold text-xl text-white m-0">Reviews</h2>
      </div>
      <div className="flex flex-col gap-2">
        {moreReviews.map((review, index) => {
          return <ReviewCard key={index} review={review} />;
        })}
      </div>
      {totalReviewPages > 1 && currentReviewPage !== totalReviewPages && (
        <button
          onClick={() => fetchMoreReviews((currentReviewPage += 1))}
          className="text-primary-blue py-2 flex justify-center hocus:bg-white hocus:bg-opacity-10 rounded-lg"
        >
          Load more reviews
        </button>
      )}
    </div>
  );
}
