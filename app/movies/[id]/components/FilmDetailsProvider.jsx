"use client";

import React from "react";
import FilmContent from "./FilmContent";
import { DetailsProvider } from "../context";

export default function FilmDetailsProvider({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
  isTvPage,
}) {
  return (
    <DetailsProvider>
      <FilmContent
        film={film}
        videos={videos}
        images={images}
        reviews={reviews}
        credits={credits}
        providers={providers}
        isTvPage={isTvPage}
      />
    </DetailsProvider>
  );
}
