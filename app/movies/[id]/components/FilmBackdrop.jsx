/* eslint-disable @next/next/no-img-element */
import ImagePovi from "@/app/components/ImagePovi";
import Reveal from "@/app/lib/Reveal";
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
        className={`max-h-[100svh] md:min-h-[500px] overflow-hidden z-0 absolute inset-0 w-full before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 before:z-0 aspect-video md:opacity-[50%] lg:max-h-[120svh]`}
      />
    </Reveal>
  );
}
