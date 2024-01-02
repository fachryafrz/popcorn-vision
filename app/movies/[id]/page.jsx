import React from "react";
import FilmBackdrop from "./components/FilmBackdrop";
import FilmSlider from "@/app/components/FilmSlider";
import { fetchData, getFilm, getGenres } from "@/app/api/route";
import { releaseStatus } from "@/app/lib/releaseStatus";
import FilmDetailsProvider from "./components/FilmDetailsProvider";

export async function generateMetadata({ params, type = "movie" }) {
  const { id } = params;

  const film = await fetchData({
    endpoint: `/${type}/${id}`,
  });
  const images = await fetchData({
    endpoint: `/${type}/${id}/images`,
    queryParams: {
      include_image_language: "en",
    },
  });
  const isTvPage = type !== "movie" ? true : false;

  const filmReleaseDate = film.release_date
    ? new Date(film.release_date).getFullYear()
    : releaseStatus(film.status);

  let backdrops;

  // if (images.backdrops.length > 0) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${images.backdrops[0].file_path}`,
  //   };
  // } else if (film.backdrop_path) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${film.backdrop_path}`,
  //   };
  // } else if (film.poster_path) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${film.poster_path}`,
  //   };
  // }

  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    backdrops = {
      images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${path}`,
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

  const isTvPage = type === "tv" ? true : false;

  const film = await fetchData({
    endpoint: `/${type}/${id}`,
    queryParams: {
      append_to_response:
        "credits,videos,reviews,watch/providers,recommendations,similar",
    },
  });
  const images = await fetchData({
    endpoint: `/${type}/${id}/images`,
    queryParams: {
      include_image_language: "en",
    },
  });

  const {
    credits,
    videos,
    reviews,
    "watch/providers": providers,
    recommendations,
    similar,
  } = film;

  // This can cause double data from recommendation & similar
  // which means there can be two same movies in the list
  let recommendationsAndSimilar = {
    results: [...recommendations.results, ...similar.results],
  };

  const genres = await getGenres({ type });

  // Schema.org JSON-LD
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
          result.type === "Clip"
      );

  let actorsArray = [];
  let genresArray = [];
  let productionCompaniesArray = [];
  let imagesArray = [];
  let trailerArray = [];
  let reviewsArray = [];

  credits.cast.slice(0, 2).map((actor) => {
    actorsArray.push({
      "@type": "Person",
      name: actor.name,
    });
  });
  film.genres.map((genre) => {
    genresArray.push(genre.name);
  });
  film.production_companies.map((company) => {
    productionCompaniesArray.push({
      "@type": "Organization",
      name: company.name,
    });
  });
  images.backdrops.slice(0, 2).map((image) => {
    imagesArray.push({
      "@type": "ImageObject",
      contentUrl: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${image.file_path}`,
    });
  });
  filteredVideos.map((video) => {
    trailerArray.push({
      "@type": "VideoObject",
      name: video.name,
      description: video.type,
      thumbnailUrl: `https://i.ytimg.com/vi_webp/${video.key}/maxresdefault.webp`,
      embedUrl: `https://www.youtube.com/embed/${video.key}`,
      uploadDate: video.published_at,
    });
  });
  reviews.results.map((review) => {
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
        worstRating: 1,
      },
      reviewBody: review.content,
    });
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": !isTvPage ? "Movie" : "TVSeries",
    name: !isTvPage ? film.title : film.name,
    description: film.overview,
    genre: genresArray,
    productionCompany: productionCompaniesArray,
    datePublished: !isTvPage ? film.release_date : film.first_air_date,
    duration: `PT${filmRuntime}M`,
    director: {
      "@type": "Person",
      name: director.name,
    },
    actor: actorsArray,
    image: imagesArray,
    trailer: trailerArray,
    review: reviewsArray,
  };

  return (
    <div
      className={`flex flex-col bg-base-100 text-white pb-[2rem] md:pb-[5rem] md:-mt-[66px] relative`}
    >
      {/* Movie Background/Backdrop */}
      <FilmBackdrop film={film} />

      {/* Film Contents */}
      <FilmDetailsProvider
        film={film}
        videos={videos}
        images={images}
        reviews={reviews}
        credits={credits}
        providers={providers}
        isTvPage={isTvPage}
      />

      {/* Recommendations */}
      {recommendations.results.length > 0 && (
        <FilmSlider
          films={recommendations}
          title={
            recommendations.results.length > 1
              ? `Recommendations`
              : `Recommendation`
          }
          genres={genres}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
