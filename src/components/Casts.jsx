import { Loading } from "./Loading";

const Casts = ({ logo, actor, index, loading }) => {
  return (
    <div key={index} className="flex gap-2 items-center">
      <figure className="!w-[50px] !h-[50px] aspect-squar rounded-full overflow-hidden flex-shrink-0">
        <div
          className={
            actor.profile_path === null
              ? `w-full h-full bg-base-dark-gray p-2`
              : `hidden`
          }
        >
          <img loading="lazy" src={logo} alt={import.meta.env.VITE_APP_NAME} />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
          />
        )}
      </figure>
      <div className="w-full">
        {loading ? (
          <Loading height="[20px]" className="!w-full" />
        ) : (
          <h3 title={actor.name} className="font-medium line-clamp-1">
            {actor.name}
          </h3>
        )}
        {loading ? (
          <Loading height="[10px] mt-1" className="!w-full" />
        ) : (
          <p className="text-sm text-gray-400 line-clamp-1">
            {actor.character !== "" && (
              <span title={actor.character}>as {actor.character}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Casts;
