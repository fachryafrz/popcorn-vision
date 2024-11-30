import React from "react";
import FilmBackdrop from "../../../../components/Film/Details/Backdrop";
import { fetchData, getGenres } from "@/lib/fetch";
import { releaseStatus } from "@/lib/releaseStatus";
import FilmContent from "../../../../components/Film/Details/Content";
import Recommendation from "@/components/Film/Recommendation";
import AdultModal from "@/components/Modals/AdultModal";
import moment from "moment";

export async function generateMetadata({ params, type = "movie" }) {
  const { id } = params;

  const [film, images] = await Promise.all([
    fetchData({
      endpoint: `/${type}/${id}`,
    }),
    fetchData({
      endpoint: `/${type}/${id}/images`,
      queryParams: {
        include_image_language: "en",
      },
    }),
  ]);
  const isTvPage = type !== "movie" ? true : false;

  const filmReleaseDate = film.release_date
    ? new Date(film.release_date).getFullYear()
    : releaseStatus(film.status);

  let backdrops;

  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    backdrops = {
      images: `https://image.tmdb.org/t/p/w500${path}`,
    };
  }

  return {
    title: `${film.title} (${filmReleaseDate})`,
    description: film.overview,
    alternates: {
      canonical: `/${`movies`}/${film.id}`,
    },
    openGraph: {
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${`movies`}/${film.id}`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      ...backdrops,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      creator: "@fachryafrz",
      ...backdrops,
    },
  };
}

export default async function FilmDetail({ params, type = "movie" }) {
  const { id } = params;

  const isTvPage = type === "tv";

  const [film, images, genres] = await Promise.all([
    fetchData({
      endpoint: `/${type}/${id}`,
      queryParams: {
        append_to_response:
          "credits,videos,reviews,watch/providers,recommendations,similar,release_dates",
      },
    }),
    fetchData({
      endpoint: `/${type}/${id}/images`,
      queryParams: {
        include_image_language: "en",
      },
    }),
    getGenres({ type }),
  ]);

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
  const isThereRecommendations = recommendations.results.length > 0;
  const isThereSimilar = similar.results.length > 0;

  let collection;

  if (film.belongs_to_collection) {
    collection = await fetchData({
      endpoint: `/collection/${film.belongs_to_collection.id}`,
    });
  }

  // This can cause double data from recommendation & similar
  // which means there can be two same movies in the list
  let recommendationsAndSimilar = {
    results: [...recommendations.results, ...similar.results],
  };

  // Schema.org JSON-LD
  const DATA_COUNT = 2;

  let director = credits.crew.find((person) => person.job === "Director");

  const filmRuntime = !isTvPage
    ? film.runtime
    : film.episode_run_time.length > 0 && film.episode_run_time[0];

  const filteredVideos =
    videos &&
    videos.results
      .reverse()
      .filter(
        (result) =>
          (result.site === "YouTube" &&
            result.official === true &&
            result.iso_639_1 === "en" &&
            result.type === "Trailer") ||
          result.type === "Teaser" ||
          result.type === "Clip",
      );

  let directorsArray = [];
  let actorsArray = [];
  let genresArray = [];
  let productionCompaniesArray = [];
  let imagesArray = [];
  let trailerArray = [];
  let reviewsArray = [];

  // Director / Creator
  !isTvPage
    ? director &&
      directorsArray.push({ "@type": "Person", name: director.name })
    : film.created_by.length &&
      film.created_by.map((creator) => {
        directorsArray.push({ "@type": "Person", name: creator.name });
      });

  // Actors
  credits.cast.slice(0, DATA_COUNT).map((actor) => {
    actorsArray.push({
      "@type": "Person",
      name: actor.name,
    });
  });

  // Genres
  film.genres.map((genre) => {
    genresArray.push(genre.name);
  });

  // Production Companies
  film.production_companies.map((company) => {
    productionCompaniesArray.push({
      "@type": "Organization",
      name: company.name,
    });
  });

  // Images
  images.backdrops.slice(0, DATA_COUNT).map((image) => {
    imagesArray.push({
      "@type": "ImageObject",
      contentUrl: `https://image.tmdb.org/t/p/w500${image.file_path}`,
      url: `https://image.tmdb.org/t/p/w500${image.file_path}`,
    });
  });

  // Trailer
  filteredVideos.map((video) => {
    trailerArray.push({
      "@type": "VideoObject",
      name: video.name,
      description: video.type,
      thumbnailUrl: `https://img.youtube.com/vi/${video.key}/0.jpg`,
      embedUrl: `https://www.youtube.com/embed/${video.key}`,
      uploadDate: video.published_at,
    });
  });

  // Reviews
  reviews.results.slice(0, DATA_COUNT).map((review) => {
    if (review.author_details.rating) {
      reviewsArray.push({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.author_details.rating,
          bestRating: 10,
        },
        reviewBody: review.content,
      });
    }
  });

  const jsonLd = {
    "@context": "https://schema.org",
    // "@type": !isTvPage ? "Movie" : "TVShows", // Kalo TVShows, ga bisa di test di Google Rich Results
    "@type": "Movie",
    name: !isTvPage ? film.title : film.name,
    description: film.overview,
    genre: genresArray,
    productionCompany: productionCompaniesArray,
    datePublished: !isTvPage ? film.release_date : film.first_air_date,
    duration: `PT${filmRuntime}M`,
    director: directorsArray,
    actor: actorsArray,
    image: imagesArray,
    trailer: trailerArray,
    review: reviewsArray,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: parseInt(film.vote_average.toFixed(0)),
      bestRating: 10,
      ratingCount: film.vote_count,
    },
  };

  // console.log(jsonLd.timeRequired);

  return (
    <div
      className={`relative flex flex-col bg-base-100 pb-[2rem] text-white md:-mt-[66px] md:pb-[5rem]`}
    >
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
          genres={genres}
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
