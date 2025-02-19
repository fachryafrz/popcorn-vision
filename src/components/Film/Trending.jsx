/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import FilmSummary from "./Summary";
import { fetchData } from "@/lib/fetch";
import ImagePovi from "./ImagePovi";
import moment from "moment";
import slug from "slug";

export default async function Trending({ film, genres, type }) {
  const isTvPage = type === "tv";

  const filmDetails = await fetchData({
    endpoint: `/${!isTvPage ? `movie` : `tv`}/${film.id}`,
    queryParams: { append_to_response: `images` },
  });

  return (
    <div className="mx-auto max-w-7xl md:px-4">
      <Link
        href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
         
        className="sr-only"
      >
        <h2>{`Trending ${!isTvPage ? `Movie` : `TV Shows`}: ${film.title ?? film.name} (${moment(
          film.release_date ?? film.first_air_date,
        ).format("YYYY")})`}</h2>
      </Link>
      <p className="sr-only">{film.overview}</p>

      <div className="relative flex flex-col items-center gap-8 overflow-hidden p-8 before:invisible before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-black before:via-black before:via-30% before:opacity-[100%] after:absolute after:inset-0 after:z-20 after:bg-gradient-to-t after:from-black md:flex-row md:rounded-[3rem] md:p-[3rem] md:before:visible md:before:bg-gradient-to-r md:after:bg-gradient-to-r">
        {/* Backdrop */}
        <ImagePovi
          imgPath={film.backdrop_path}
          className={`absolute inset-0 z-0 blur-md md:left-[30%] md:blur-0`}
        >
          <img
            src={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
            role="presentation"
            loading="lazy"
            draggable={false}
            alt=""
            aria-hidden
            width={1280}
            height={720}
          />
        </ImagePovi>

        {/* Poster */}
        <div
          className={`z-30 aspect-poster h-full w-full max-w-[300px] overflow-hidden rounded-2xl`}
        >
          <ImagePovi imgPath={film.poster_path} className={`h-full`}>
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={`https://image.tmdb.org/t/p/w780${film.poster_path}`}
              />
              <img
                src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                role="presentation"
                loading="lazy"
                draggable={false}
                alt=""
                aria-hidden
                width={500}
                height={750}
              />
            </picture>
          </ImagePovi>
        </div>
        <div className="z-30 flex flex-col items-center gap-2 text-center md:max-w-[60%] md:items-start md:text-start lg:max-w-[50%]">
          {filmDetails && (
            <FilmSummary
              film={filmDetails}
              genres={genres}
              className={`!max-w-none`}
              btnClass={`btn-warning bg-opacity-[80%]`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
