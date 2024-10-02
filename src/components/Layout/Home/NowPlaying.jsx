import FilmSlider from "@/components/Film/Slider";
import { fetchData } from "@/lib/fetch";
import moment from "moment";

export default async function NowPlaying({ type, defaultParams, genres }) {
  const isTvPage = type === "tv";
  const today = moment().format("YYYY-MM-DD");
  const monthsAgo = moment().subtract(1, "months").format("YYYY-MM-DD");

  const films = await fetchData({
    endpoint: `/discover/${type}`,
    queryParams: !isTvPage
      ? {
          ...defaultParams,
          without_genres: 10749,
          "primary_release_date.gte": monthsAgo,
          "primary_release_date.lte": today,
        }
      : {
          ...defaultParams,
          "first_air_date.gte": monthsAgo,
          "first_air_date.lte": today,
        },
  });

  return (
    <FilmSlider
      films={films}
      title={!isTvPage ? `Now Playing` : `On The Air`}
      genres={genres}
      viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${monthsAgo}..${today}`}
    />
  );
}
