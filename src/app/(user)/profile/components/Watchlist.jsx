import FilmSlider from "@/components/Film/FilmSlider";
import { fetchData, getGenres } from "@/lib/fetch";
import { useCookies } from "next-client-cookies";
import React, { useEffect, useState } from "react";

export default function Watchlist({ user }) {
  const cookies = useCookies();

  const [films, setFilms] = useState();
  const [genres, setGenres] = useState();

  useEffect(() => {
    const fetchWatchlist = async () => {
      await fetchData({
        endpoint: `/account/${user.id}/watchlist/movies`,
        queryParams: {
          session_id: cookies.get("tmdb.session_id"),
        },
      }).then((res) => {
        setFilms(res);
      });
    };
    fetchWatchlist();

    const fetchGenres = async () => {
      await getGenres({
        type: "movie",
      }).then((data) => {
        setGenres(data);
      });
    };
    fetchGenres();
  }, [user]);

  if (films) {
    return <FilmSlider films={films} title={`Watchlist`} genres={genres} />;
  }
}
