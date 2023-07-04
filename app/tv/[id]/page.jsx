import FilmDetail from "@/app/movies/[id]/page";
import React from "react";

export default function page({ params }) {
  return <FilmDetail params={params} type="tv" />;
}
