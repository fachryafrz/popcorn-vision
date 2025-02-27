/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ImagePovi from "./ImagePovi";
import { formatRating } from "@/lib/formatRating";
import slug from "slug";
import { useHoverCard } from "@/zustand/hoverCard";
import moment from "moment";

export default function FilmCard({ film, isTvPage }) {
  // Global State
  const { handleMouseOver, setPosition } = useHoverCard();

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <Link
      id="film-card"
      href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
      onMouseEnter={(e) => {
        const initialPosition = e.target.getBoundingClientRect();

        const position = {
          x: initialPosition.x,
          y: initialPosition.y,
          width: initialPosition.width,
          height: initialPosition.height,
          top:
            initialPosition.top +
            window.scrollY +
            (initialPosition.height / 2 - 200),
          right: initialPosition.right,
          bottom: initialPosition.bottom,
          left: initialPosition.left,
        };

        setPosition(position);
        handleMouseOver(film);
      }}
      onMouseLeave={() => handleMouseOver.clear()}
      prefetch={false}
      className={`relative`}
    >
      <h3 className={`sr-only`}>
        {`${film.title ?? film.name} (${moment(film.release_date ?? film.first_air_date).format("YYYY")})`}
      </h3>

      <ImagePovi
        imgPath={film.poster_path}
        className={`relative aspect-poster overflow-hidden rounded-xl`}
      >
        {/* 
          NOTE: alt="" is for decorative

          source: https://stackoverflow.com/questions/52556295/role-presentation-or-aria-hidden-true-for-decorative-images 
        */}

        <img
          src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
          role="presentation"
          loading="lazy"
          draggable={false}
          alt=""
          aria-hidden
          width={100}
          height={150}
        />

        {film.vote_average > 0 && (
          <div
            className={`pointer-events-none absolute left-0 top-0 m-2 rounded-full bg-base-100 bg-opacity-50 p-1 backdrop-blur-sm`}
          >
            <div
              className={`radial-progress text-sm font-semibold ${
                film.vote_average > 0 && film.vote_average < 3
                  ? `text-primary-red`
                  : film.vote_average >= 3 && film.vote_average < 7
                    ? `text-primary-yellow`
                    : `text-green-500`
              }`}
              style={{
                "--value": film.vote_average * 10,
                "--size": "30px",
                "--thickness": "3px",
              }}
            >
              <span
                className={`after-content text-xs text-white`}
                data-after-content={formatRating(film.vote_average)}
              />
            </div>
          </div>
        )}
      </ImagePovi>
    </Link>
  );
}
