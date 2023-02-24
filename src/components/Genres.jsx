import genres from "../genres.json";
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useEffect, useState } from "react";

const Genres = () => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const getIcons = () => {
      setIcons(genres.map((genre) => Icons[genre.icon]));
    };

    getIcons();
  }, []);

  return (
    <div className="px-4 py-[2rem] md:py-[5rem] lg:px-[9rem] flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col text-center justify-between items-center gap-8 lg:flex-row lg:text-start lg:gap-[4rem]">
        <h2 className="sr-only">Genres</h2>
        <p className="lg:w-[55%] font-bold text-4xl md:text-5xl leading-tight tracking-wide">
          Choose the type of films you liked
        </p>
        <p className="lg:w-[45%] font-light text-lg md:text-xl">
          We present many films from various main categories, let's choose and
          find the film you liked
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <div
            key={genre.id}
            className="p-6 rounded-[1.5rem] bg-base-gray bg-opacity-10 flex flex-col text-center gap-4 items-center xl:flex-row xl:text-start"
          >
            <figure className="bg-base-dark-gray p-4 rounded-xl h-[3.5rem]">
              <IonIcon
                icon={icons[index]}
                className="text-[1.5rem] text-primary-blue"
              ></IonIcon>
            </figure>
            <div>
              <h3 className="font-bold text-lg">{genre.type}</h3>
              <p className="text-gray-400">{genre.count}+ Movies</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;
