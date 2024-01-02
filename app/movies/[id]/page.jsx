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
  let image;
  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    image = `${process.env.NEXT_PUBLIC_API_IMAGE_500}${path}`;
  }

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": !isTvPage ? "Movie" : "TVSeries",
    name: !isTvPage ? film.title : film.name,
    description: film.overview,
    genre: film.genres.map((genre) => genre.name).join(", "),
    productionCompany: {
      "@type": "Organization",
      name: film.production_companies[0].name,
    },
    datePublished: !isTvPage ? film.release_date : film.first_air_date,
    duration: `PT${filmRuntime}M`,
    director: {
      "@type": "Person",
      name: director.name,
    },
    actor: [
      {
        "@type": "Person",
        name: credits.cast[0].name,
      },
      {
        "@type": "Person",
        name: credits.cast[1].name,
      },
    ],
    image: image,
    trailer: {
      "@type": "VideoObject",
      name: filteredVideos[0].name,
      description: filteredVideos[0].type,
      thumbnailUrl: `https://i.ytimg.com/vi_webp/${filteredVideos[0].key}/maxresdefault.webp`,
      embedUrl: `https://www.youtube.com/embed/${filteredVideos[0].key}`,
      uploadDate: filteredVideos[0].published_at,
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: reviews.results[0].author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: reviews.results[0].author_details.rating,
        bestRating: 10,
        worstRating: 1,
      },
      reviewBody: reviews.results[0].content,
    },
  };

  console.log(jsonLd)

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
