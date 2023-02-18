import { IonIcon } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";

import data from "../highlight.json";

const Trending = () => {
  const trending = data.slice(2, 3)[0];

  return (
    <div className="px-4 lg:px-[9rem]">
      <h2 className="sr-only">Trending</h2>
      <div className="relative flex flex-col items-center lg:flex-row gap-8 p-8 lg:p-[3rem] rounded-xl md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t lg:before:bg-gradient-to-r before:from-black before:via-black before:opacity-[70%] before:invisible lg:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-r after:from-black">
        <figure className="absolute inset-0 z-0 blur lg:blur-none">
          <img src={trending.img} alt={trending.title} />
        </figure>
        <figure className="z-30 max-w-[300px] aspect-poster rounded-2xl overflow-hidden">
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg"
            alt={trending.title}
          />
        </figure>
        <div className="z-30 flex flex-col items-center text-center gap-2 md:max-w-[60%] lg:max-w-[400px] lg:items-start lg:text-start">
          <div className="flex gap-2 items-center">
            <figure className="w-[50px] self-center ">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/575px-IMDB_Logo_2016.svg.png"
                alt="IMDb"
              />
            </figure>
            <span className="text-xl font-bold">{trending.rating}</span>
          </div>
          <span className="text-gray-400">
            {trending.runtime} &bull; {trending.genre} &bull;{" "}
            {trending.release_date}
          </span>
          <h3 className="font-bold text-4xl lg:text-5xl">{trending.title}</h3>
          <p>{trending.synopsys}</p>
          <a
            href="#!"
            className="w-full mt-4 p-4 md:px-8 rounded-lg bg-primary-yellow text-black uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100"
          >
            <IonIcon
              icon={informationCircleOutline}
              className="!w-5 h-full aspect-square"
            />
            Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default Trending;
