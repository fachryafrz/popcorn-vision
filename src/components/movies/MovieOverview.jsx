import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export function MovieOverview({ logo, movie, page, isTvPage }) {
  const [readMore, setReadMore] = useState(false);
  const history = useHistory();

  const handleReadMore = () => {
    setReadMore(!readMore);
  };

  const handleGoBack = () => {
    history.goBack();
  };
  return (
    <div className="flex flex-col gap-6 self-start w-full">
      <div className="flex gap-4 items-center md:gap-0">
        <div className="min-w-fit flex flex-col gap-1">
          <figure className="max-w-[100px] md:hidden lg:max-w-[250px] aspect-poster rounded-lg overflow-hidden self-start">
            <div
              className={
                movie.poster_path === null
                  ? `w-full h-full bg-base-dark-gray`
                  : `hidden`
              }
            >
              <img
                src={logo}
                alt="Popcorn Prespective"
                className="w-fit h-fit"
              />
            </div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={!isTvPage ? movie.title : movie.name}
              className={movie.poster_path === null ? `hidden` : `block`}
            />
          </figure>
          <button
            onClick={handleGoBack}
            className="flex gap-2 items-center justify-center bg-base-gray bg-opacity-10 py-2 rounded-lg text-sm hover:bg-opacity-30 active:bg-opacity-50 md:hidden"
          >
            <IonIcon
              icon={Icons.returnDownBack}
              className="!w-4 h-full aspect-square"
            />
            Go Back
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <h1
            title={!isTvPage ? movie.title : movie.name}
            className="font-bold text-3xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2"
          >
            {!isTvPage ? movie.title : movie.name}
          </h1>
          <div className="text-gray-400 sm:hidden text-sm flex flex-wrap gap-1 items-center">
            {new Date(
              !isTvPage ? movie.release_date : movie.first_air_date
            ).getFullYear()}{" "}
            &bull;{" "}
            {!isTvPage
              ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
              : `${
                  movie.last_episode_to_air && movie.last_episode_to_air.runtime
                }m`}{" "}
            &bull;
            {movie.genres &&
              movie.genres.map((genre) => {
                return (
                  <span
                    key={genre.id}
                    className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray self-start"
                  >
                    {genre.name}
                  </span>
                );
              })}
          </div>
          <table className="max-w-fit hidden sm:block">
            <tbody>
              <tr>
                <td className="pr-8 py-1 text-gray-400">Genre</td>
                <td className="flex gap-1">
                  {movie.genres &&
                    movie.genres.map((genre) => {
                      return (
                        <span
                          key={genre.id}
                          className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray self-center"
                        >
                          {genre.name}
                        </span>
                      );
                    })}
                </td>
              </tr>
              <tr>
                <td className="pr-8 py-1 text-gray-400">Runtime</td>
                <td>{`${Math.floor(
                  !isTvPage
                    ? movie.runtime / 60
                    : movie.last_episode_to_air &&
                        movie.last_episode_to_air.runtime
                )}h ${
                  !isTvPage
                    ? movie.runtime % 60
                    : movie.last_episode_to_air &&
                      movie.last_episode_to_air.runtime
                }m`}</td>
              </tr>
              <tr>
                <td className="pr-8 py-1 text-gray-400">Release Date</td>
                <td>
                  {new Date(
                    !isTvPage ? movie.release_date : movie.first_air_date
                  ).getFullYear()}
                </td>
              </tr>
              {isTvPage && (
                <tr>
                  <td className="pr-8 py-1 text-gray-400">Seasons</td>
                  <td>{movie.number_of_seasons}</td>
                </tr>
              )}
              {isTvPage && (
                <tr>
                  <td className="pr-8 py-1 text-gray-400">Episodes</td>
                  <td>{movie.number_of_episodes}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-white flex flex-col gap-6">
        <div className="flex flex-col gap-2 ">
          <h2 className="font-bold text-2xl text-white m-0">Overview</h2>
          <p className="text-gray-400 text-lg">{movie.overview}</p>
        </div>
        <div className="flex flex-col gap-2">
          {movie.reviews && movie.reviews.results.length !== 0 ? (
            <div className="flex gap-4 items-center justify-between bg-base-dark-gray sticky top-[4.125rem] py-2 bg-opacity-90 backdrop-blur-sm">
              <h2 className="font-bold text-2xl text-white m-0">Reviews</h2>
              <button
                onClick={handleReadMore}
                className="text-primary-blue hover:font-medium transition-all"
              >
                {`${readMore ? "Shrink" : "Expand all"}`}
              </button>
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-col gap-2">
            {movie.reviews &&
              movie.reviews.results &&
              movie.reviews.results.map((review, index) => {
                const dateStr = review.updated_at;
                const date = new Date(dateStr);
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                const formattedDate = date.toLocaleString("en-US", options);

                const imgUrlAPI = review.author_details.avatar_path;
                const imgUrl = imgUrlAPI?.startsWith("/http")
                  ? imgUrlAPI.replace(/^\//, "")
                  : `https://image.tmdb.org/t/p/w500${imgUrlAPI}`;

                return (
                  <div
                    key={index}
                    id="reviewsCard"
                    className="flex flex-col gap-4 bg-gray-400 bg-opacity-10 p-4 rounded-xl"
                  >
                    <div className="flex gap-4">
                      <figure className="aspect-square w-[50px] self-center rounded-full overflow-hidden">
                        <div
                          className={
                            imgUrlAPI === null
                              ? `w-full h-full bg-base-dark-gray p-2`
                              : `hidden`
                          }
                        >
                          <img src={logo} alt="Popcorn Prespective" />
                        </div>
                        {imgUrl && (
                          <img src={`${imgUrl}`} alt={review.author} />
                        )}
                      </figure>
                      <div>
                        <p className="font-medium text-lg">{review.author}</p>
                        <span className="text-sm text-gray-400">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${
                        readMore ? "" : "line-clamp-3"
                      } prose max-w-none text-gray-400`}
                    >
                      <div>{review.content}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
