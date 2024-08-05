/* eslint-disable @next/next/no-img-element */
import ImagePovi from "@/components/Film/ImagePovi";
import Reveal from "@/components/Layout/Reveal";
import React from "react";

export default function FilmBackdrop({ film }) {
  return (
    <Reveal y={0} delay={1.2}>
      <ImagePovi
        imgPath={
          film.backdrop_path &&
          `https://image.tmdb.org/t/p/original${film.backdrop_path}`
        }
        position={`top`}
        className={`absolute inset-0 z-0 aspect-video max-h-[100dvh] w-full overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-t before:from-base-100 md:min-h-[500px] md:opacity-[50%] lg:max-h-[120dvh]`}
      />
    </Reveal>
  );
}
