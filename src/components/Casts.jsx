import { Loading } from "./Loading";

const Casts = ({ logo, actor, index, loading }) => {
  return (
    <div
      key={index}
      className="flex flex-col lg:flex-row text-center lg:text-start gap-2 items-center lg:items-start min-w-[120px]"
    >
      <figure className="!w-[50px] !h-[50px] aspect-square rounded-full overflow-hidden flex-shrink-0">
        <div
          className={
            actor.profile_path === null
              ? `w-full h-full bg-base-dark-gray p-2`
              : `hidden`
          }
        >
          {loading ? (
            <Loading
              width="auto"
              height="auto"
              classNames={`!w-[50px] !h-[50px] aspect-square rounded-full -m-2`}
            />
          ) : (
            <img
              loading="lazy"
              src={logo}
              alt={import.meta.env.VITE_APP_NAME}
            />
          )}
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
      <div className="w-full self-center">
        {loading ? (
          <Loading height="[20px]" className="!w-full" />
        ) : (
          <h3 title={actor.name} className="font-medium lg:line-clamp-1">
            {actor.name}
          </h3>
        )}

        {actor.character !== "" && (
          <>
            {loading ? (
              <Loading height="[10px] mt-1" className="!w-full" />
            ) : (
              <p
                className={`text-sm text-gray-400 lg:line-clamp-1 max-w-[120px] lg:max-w-none mx-auto lg:mx-0 before:content-['as'] before:mr-1`}
              >
                <span title={actor.character}>{actor.character}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Casts;
