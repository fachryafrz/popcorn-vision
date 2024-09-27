import FilmSlider from "@/components/Film/Slider";
import { fetchData } from "@/lib/fetch";
import moment from "moment";

export default async function Upcoming({ type, defaultParams, genres }) {
  const isTvPage = type === "tv";
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
  const monthsLater = moment().add(1, "months").format("YYYY-MM-DD");

  const films = await fetchData({
    endpoint: `/discover/${type}`,
    queryParams: !isTvPage
      ? {
          ...defaultParams,
          without_genres: 18,
          "primary_release_date.gte": tomorrow,
          "primary_release_date.lte": monthsLater,
        }
      : {
          ...defaultParams,
          without_genres: 18,
          "first_air_date.gte": tomorrow,
          "first_air_date.lte": monthsLater,
        },
  });

  return (
    <FilmSlider
      films={films}
      title={`Upcoming`}
      genres={genres}
      sort={"ASC"}
      viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${tomorrow}..${monthsLater}`}
    />
  );
}
