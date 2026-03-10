"use client";

import React from "react";
import useSWR from "swr";
import FilmBackdrop from "@/components/Film/Details/Backdrop";
import FilmContent from "@/components/Film/Details/Content";
import Recommendation from "@/components/Film/Recommendation";
import AdultModal from "@/components/Modals/AdultModal";
import { movieGenres } from "@/data/movie-genres";
import { tvGenres } from "@/data/tv-genres";
import { axios } from "@/lib/axios";

export default function ClientFilmDetail({ id, type = "movie" }) {
  const isTvPage = type === "tv";

  const { data: film, error: filmError, isLoading: filmLoading } = useSWR(
    `/api/${type}/${id}?append_to_response=credits,videos,reviews,watch/providers,recommendations,similar,release_dates`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const { data: images, error: imagesError, isLoading: imagesLoading } = useSWR(
    `/api/${type}/${id}/images?include_image_language=en`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const { data: collection } = useSWR(
    film?.belongs_to_collection ? `/api/collection/${film.belongs_to_collection.id}` : null,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (filmLoading || imagesLoading) {
    return (
      <div className={`relative flex flex-col bg-base-100 pb-[2rem] text-white md:-mt-[66px] md:pb-[5rem] min-h-screen items-center justify-center`}>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (filmError || imagesError || !film || !images) {
    return <div className="p-8 text-center text-red-500">Failed to load {type} details.</div>;
  }

  const {
    credits,
    videos,
    reviews,
    "watch/providers": providers,
    recommendations,
    similar,
    release_dates: releaseDates,
    adult,
  } = film;

  const isThereRecommendations = recommendations?.results?.length > 0;
  const isThereSimilar = similar?.results?.length > 0;

  // Schema.org JSON-LD (Keeping basic client-side LD construction if needed, but SEO is mainly from generateMetadata)
  const DATA_COUNT = 2;
  const filmRuntime = !isTvPage ? film.runtime : (film.episode_run_time?.length > 0 ? film.episode_run_time[0] : null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: !isTvPage ? film.title : film.name,
    description: film.overview,
    datePublished: !isTvPage ? film.release_date : film.first_air_date,
    duration: `PT${filmRuntime || 0}M`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseInt((film.vote_average || 0).toFixed(0)),
      bestRating: 10,
      ratingCount: film.vote_count,
    },
  };

  return (
    <div className={`relative flex flex-col bg-base-100 pb-[2rem] text-white md:-mt-[66px] md:pb-[5rem]`}>
      <h1 className="sr-only">{film.title ?? film.name}</h1>

      {/* Movie Background/Backdrop */}
      <FilmBackdrop film={film} />

      {/* Film Contents */}
      <FilmContent
        film={film}
        videos={videos}
        images={images}
        reviews={reviews}
        credits={credits}
        providers={providers}
        collection={collection}
        isTvPage={isTvPage}
        releaseDates={releaseDates}
      />

      {/* Recommendations */}
      {(isThereRecommendations || isThereSimilar) && (
        <Recommendation
          id={id}
          similar={similar}
          recommendations={recommendations}
          title={
            isThereRecommendations && isThereSimilar
              ? "Recommendation & Similar"
              : isThereRecommendations && !isThereSimilar
                ? "Recommendation"
                : isThereSimilar && !isThereRecommendations
                  ? "Similar"
                  : ""
          }
          genres={!isTvPage ? movieGenres : tvGenres}
        />
      )}

      {/* Modals */}
      {adult && <AdultModal adult={adult} />}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
