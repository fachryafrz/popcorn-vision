import { Loading } from "./Loading";
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router-dom";

export function MoviePoster({ logo, movie, isTvPage, loading }) {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="max-w-[200px] hidden md:flex flex-col gap-2 lg:max-w-[250px] self-start sticky top-20">
      <figure className="w-[200px] lg:w-[250px] aspect-poster rounded-xl overflow-hidden">
        <div
          className={
            movie.poster_path === null
              ? `w-full h-full bg-base-dark-gray flex items-center`
              : `hidden`
          }
        >
          <img
            src={logo}
            alt="Popcorn Prespective"
            className="object-none w-fit h-fit"
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        )}
      </figure>
      <button
        onClick={handleGoBack}
        className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-10 uppercase font-medium tracking-wider flex justify-center items-center gap-2 transition-all hover:bg-opacity-30 active:bg-opacity-50"
      >
        <IonIcon
          icon={Icons.returnDownBack}
          className="!w-5 h-full aspect-square"
        />
        Go Back
      </button>
    </div>
  );
}
