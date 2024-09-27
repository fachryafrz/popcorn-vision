import FilmSlider from "@/components/Film/Slider";
import { fetchData } from "@/lib/fetch";
import moment from "moment";

export default async function TopRated({ type, defaultParams, genres }) {
  const isTvPage = type === "tv";

  const films = await fetchData({
    endpoint: `/discover/${type}`,
    queryParams: {
      ...defaultParams,
      // without_genres: 18,
      sort_by: "vote_count.desc",
    },
  });

  return (
    <FilmSlider
      films={films}
      title={`Top Rated`}
      genres={genres}
      viewAll={`${
        !isTvPage ? `/search` : `/tv/search`
      }?sort_by=vote_count.desc`}
    />
  );
}
