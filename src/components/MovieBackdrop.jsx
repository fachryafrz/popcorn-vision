import React from "react";
import { Loading } from "./Loading";

export function MovieBackdrop({ logo, movie, isTvPage, loading }) {
  return (
    <figure className="max-h-[100vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80vh]">
      <div
        className={
          movie.backdrop_path === null
            ? `w-full h-full bg-base-dark-gray flex justify-center`
            : `hidden`
        }
      >
        {loading ? (
          <Loading
            classNames={`h-full relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-10`}
          />
        ) : (
          <img
            loading="lazy"
            src={logo}
            alt={import.meta.env.VITE_APP_NAME}
            className="object-contain"
          />
        )}
      </div>

      {loading ? (
        <Loading
          classNames={`h-full relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-10`}
        />
      ) : (
        <img
          loading="lazy"
          src={`${import.meta.env.VITE_API_IMAGE_URL_1280}${
            movie.backdrop_path
          }`}
          alt={!isTvPage ? movie.title : movie.name}
          className="object-top"
        />
      )}
    </figure>
  );
}
