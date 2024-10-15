import Link from "next/link";
import ImagePovi from "./ImagePovi";
import debounce from "debounce";
import { formatRating } from "@/lib/formatRating";
import slug from "slug";
import { useHoverCard } from "@/zustand/hoverCard";

export default function FilmCard({ film, isTvPage }) {
  // Global State
  const { setHoverCard, setPosition, handleMouseOver } = useHoverCard();

  // Functions
  // const handleMouseOver = debounce((e, film) => {
  //   setHoverCard(film);
  //   setPosition(e.target.getBoundingClientRect());
  // }, 400);
  // const handleMouseLeave = () => {
  //   setHoverCard(null);
  //   setPosition(null);
  //   handleMouseOver.clear();
  // };

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <Link
      id="FilmCard"
      href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
      onMouseEnter={(e) => handleMouseOver(e, film)}
      // onMouseLeave={handleMouseLeave}
      prefetch={true}
      className={`relative`}
    >
      <span className={`sr-only`}>{isItTvPage(film.title, film.name)}</span>

      <ImagePovi
        imgPath={
          film.poster_path &&
          `https://image.tmdb.org/t/p/w300${film.poster_path}`
        }
        className={`relative aspect-poster overflow-hidden rounded-xl`}
      >
        {film.vote_average > 0 && (
          <div
            className={`absolute left-0 top-0 m-2 rounded-full bg-base-100 bg-opacity-50 p-1 backdrop-blur-sm`}
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
