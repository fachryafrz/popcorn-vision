import React, { Suspense } from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import FilmSlider from "@/components/Film/Slider";
import Trending from "@/components/Film/Trending";
import SkeletonSlider from "@/components/Skeleton/main/Slider";
import SkeletonTrending from "@/components/Skeleton/main/Trending";
import SkeletonHomeSlider from "@/components/Skeleton/main/HomeSlider";
import Script from "next/script";
import { axios } from "@/lib/axios";
import { companies } from "@/data/companies";
import { providers } from "@/data/providers";
import { movieGenres } from "@/data/movie-genres";
import { tvGenres } from "@/data/tv-genres";
import { siteConfig } from "@/config/site";
import { fetchInBatches } from "@/lib/fetchInBatches";
import dayjs from "dayjs";

export default async function Home({ type = "movie" }) {
  const isTvPage = type === "tv";

  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "days").format("YYYY-MM-DD");
  const monthsAgo = dayjs().subtract(3, "months").format("YYYY-MM-DD");
  const monthsLater = dayjs().add(3, "months").format("YYYY-MM-DD");

  const defaultParams = {
    region: "US",
    include_adult: false,
    language: "en-US",
    sort_by: "popularity.desc",
    with_original_language: "en",
    ...(isTvPage && { include_null_first_air_dates: false }),
  };

  function dateParams(gte, lte) {
    return isTvPage
      ? { "first_air_date.gte": gte, "first_air_date.lte": lte }
      : { "primary_release_date.gte": gte, "primary_release_date.lte": lte };
  }

  // Fetch main data
  const [trending, nowPlaying, upcoming, topRated] = await Promise.all([
    axios.get(`/trending/${type}/week`).then((r) => r.data.results),

    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, ...dateParams(monthsAgo, today) },
      })
      .then((r) => r.data),

    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, ...dateParams(tomorrow, monthsLater) },
      })
      .then((r) => r.data),

    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, sort_by: "vote_count.desc" },
      })
      .then((r) => r.data),
  ]);

  // Companies & Providers (batched requests)
  const companiesFilms = await fetchInBatches(companies, (c) =>
    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, with_companies: c.id },
      })
      .then((r) => r.data),
  );

  const providersFilms = await fetchInBatches(providers, (p) =>
    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, with_networks: p.id },
      })
      .then((r) => r.data),
  );

  // Home slider data
  const homeSliderData = await fetchInBatches(trending.slice(0, 5), (film) =>
    axios
      .get(`/${type}/${film.id}`, {
        params: { append_to_response: "images" },
      })
      .then((r) => r.data),
  );

  // Genres
  const genreList = isTvPage
    ? tvGenres.filter((g) => [35, 10751, 10765].includes(g.id))
    : movieGenres.filter((g) => [27, 35, 878].includes(g.id));

  const genresFilms = await fetchInBatches(genreList, (genre) =>
    axios
      .get(`/discover/${type}`, {
        params: { ...defaultParams, with_genres: genre.id },
      })
      .then((r) => r.data),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": siteConfig.url,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/search?query={search_term_string}`,
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          valueRequired: true,
          valueName: "search_term_string",
        },
      },
    ],
    inLanguage: "en-US",
  };

  return (
    <>
      <h1 className="sr-only">{siteConfig.name}</h1>
      <p className="sr-only">{siteConfig.description}</p>
      <div className="-mt-[66px]">
        <Suspense fallback={<SkeletonHomeSlider />}>
          <HomeSlider
            films={trending.slice(0, 5)}
            genres={!isTvPage ? movieGenres : tvGenres}
            filmData={homeSliderData}
          />
        </Suspense>
      </div>

      <div className={`flex flex-col gap-4 lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={nowPlaying}
            title={!isTvPage ? `Now Playing` : `On The Air`}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${monthsAgo}..${today}`}
          />
        </Suspense>

        {/* Upcoming */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={upcoming}
            title={`Upcoming`}
            sort={"ASC"}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${tomorrow}..${monthsLater}`}
          />
        </Suspense>

        {/* Top Rated */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={topRated}
            title={`Top Rated`}
            viewAll={`${
              !isTvPage ? `/search` : `/tv/search`
            }?sort_by=vote_count.desc`}
          />
        </Suspense>

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[5]} type={type} />
          </Suspense>
        </section>

        {/* Companies / Providers */}
        {!isTvPage
          ? companies
              .slice(0, 3)
              .map((company, index) => (
                <FilmSlider
                  key={company.id}
                  films={companiesFilms[index]}
                  title={company.name}
                  viewAll={`${
                    !isTvPage ? `/search` : `/tv/search`
                  }?with_companies=${company.id}`}
                />
              ))
          : providers
              .slice(0, 3)
              .map((provider, index) => (
                <FilmSlider
                  key={provider.id}
                  films={providersFilms[index]}
                  title={provider.name}
                />
              ))}

        {/* Trending */}
        <section
          id={`Trending ${trending[6].title ?? trending[6].name}`}
          className="py-[2rem]"
        >
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[6]} type={type} />
          </Suspense>
        </section>

        {/* Genres */}
        {!isTvPage
          ? movieGenres
              .filter((genre) => [27, 35, 878].includes(genre.id))
              .map((genre, index) => (
                <FilmSlider
                  key={genre.id}
                  films={genresFilms[index]}
                  title={genre.name}
                  viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${
                    genre.id
                  }`}
                />
              ))
          : tvGenres
              .filter((genre) => [35, 10751, 10765].includes(genre.id))
              .map((genre, index) => (
                <FilmSlider
                  key={genre.id}
                  films={genresFilms[index]}
                  title={genre.name}
                  viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${
                    genre.id
                  }`}
                />
              ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[7]} type={type} />
          </Suspense>
        </section>
      </div>

      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
