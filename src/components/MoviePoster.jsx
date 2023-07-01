// React-related imports
import React from "react";
import { useHistory } from "react-router-dom";

// Ionic React imports
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";

// Component
import { Loading } from "./Loading";

export function MoviePoster({ logo, movie, isTvPage, loading }) {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="max-w-[200px] hidden lg:flex flex-col gap-2 md:max-w-full self-start sticky top-20">
      <figure className="aspect-poster rounded-xl overflow-hidden">
        <div
          className={
            movie.poster_path === null
              ? `w-full h-full bg-base-dark-gray flex items-center`
              : `hidden`
          }
        >
          {loading ? (
            <Loading />
          ) : (
            <img
              loading="lazy"
              src={logo}
              alt={import.meta.env.VITE_APP_NAME}
              className="object-contain w-fit h-fit"
            />
          )}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <img
            loading="lazy"
            src={`${import.meta.env.VITE_API_IMAGE_URL_500}${
              movie.poster_path
            }`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        )}
      </figure>
      <button
        onClick={handleGoBack}
        className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-10 uppercase font-medium tracking-wider flex justify-center items-center gap-2 transition-all hocus:bg-opacity-30 active:bg-opacity-50"
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
