const Casts = ({ logo, actor, index }) => {
  return (
    <div key={index} className="flex gap-2 items-start">
      <figure className="!w-[50px] !h-[50px] aspect-squar rounded-full overflow-hidden flex-shrink-0">
        <div
          className={
            actor.profile_path === null
              ? `w-full h-full bg-base-dark-gray p-2`
              : `hidden`
          }
        >
          <img src={logo} alt="Popcorn Prespective" />
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
          alt={actor.name}
        />
      </figure>
      <div>
        <h3 title={actor.name} className="font-medium line-clamp-2">
          {actor.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1">
          as <span title={actor.character}>{actor.character}</span>
        </p>
      </div>
    </div>
  );
};

export default Casts;
