import React, { Suspense } from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import Script from "next/script";
import { axios } from "@/lib/axios";
import { companies } from "@/data/companies";
import { providers } from "@/data/providers";
import { movieGenres } from "@/data/movie-genres";
import { tvGenres } from "@/data/tv-genres";
import { siteConfig } from "@/config/site";
import { fetchInBatches } from "@/lib/fetchInBatches";
import dayjs from "dayjs";
import ClientFilmSlider from "@/components/Home/ClientFilmSlider";
import ClientTrending from "@/components/Home/ClientTrending";
import SkeletonHomeSlider from "@/components/Skeleton/main/HomeSlider";

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

  // Fetch front data (Trending) used for HomeSlider on server
  const trending = await axios.get(`/trending/${type}/week`).then((r) => r.data.results);

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
            type={type}
          />
        </Suspense>
      </div>

      <div className={`flex flex-col gap-4 lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <ClientFilmSlider
          endpoint={`/discover/${type}`}
          params={{ ...defaultParams, ...dateParams(monthsAgo, today) }}
          title={!isTvPage ? `Now Playing` : `On The Air`}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${monthsAgo}..${today}`}
        />

        {/* Upcoming */}
        <ClientFilmSlider
          endpoint={`/discover/${type}`}
          params={{ ...defaultParams, ...dateParams(tomorrow, monthsLater) }}
          title={`Upcoming`}
          sort={"ASC"}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${tomorrow}..${monthsLater}`}
        />

        {/* Top Rated */}
        <ClientFilmSlider
          endpoint={`/discover/${type}`}
          params={{ ...defaultParams, sort_by: "vote_count.desc" }}
          title={`Top Rated`}
          viewAll={`${
            !isTvPage ? `/search` : `/tv/search`
          }?sort_by=vote_count.desc`}
        />

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <ClientTrending endpoint={`/trending/${type}/week`} index={5} type={type} />
        </section>

        {/* Companies / Providers */}
        {!isTvPage
          ? companies
              .slice(0, 3)
              .map((company) => (
                <ClientFilmSlider
                  key={company.id}
                  endpoint={`/discover/${type}`}
                  params={{ ...defaultParams, with_companies: company.id }}
                  title={company.name}
                  viewAll={`${
                    !isTvPage ? `/search` : `/tv/search`
                  }?with_companies=${company.id}`}
                />
              ))
          : providers
              .slice(0, 3)
              .map((provider) => (
                <ClientFilmSlider
                  key={provider.id}
                  endpoint={`/discover/${type}`}
                  params={{ ...defaultParams, with_networks: provider.id }}
                  title={provider.name}
                />
              ))}

        {/* Trending */}
        <section
          id={`Trending ${trending[6]?.title ?? trending[6]?.name ?? ""}`}
          className="py-[2rem]"
        >
          <ClientTrending endpoint={`/trending/${type}/week`} index={6} type={type} />
        </section>

        {/* Genres */}
        {!isTvPage
          ? movieGenres
              .filter((genre) => [27, 35, 878].includes(genre.id))
              .map((genre) => (
                <ClientFilmSlider
                  key={genre.id}
                  endpoint={`/discover/${type}`}
                  params={{ ...defaultParams, with_genres: genre.id }}
                  title={genre.name}
                  viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${
                    genre.id
                  }`}
                />
              ))
          : tvGenres
              .filter((genre) => [35, 10751, 10765].includes(genre.id))
              .map((genre) => (
                <ClientFilmSlider
                  key={genre.id}
                  endpoint={`/discover/${type}`}
                  params={{ ...defaultParams, with_genres: genre.id }}
                  title={genre.name}
                  viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${
                    genre.id
                  }`}
                />
              ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <ClientTrending endpoint={`/trending/${type}/week`} index={7} type={type} />
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
