import HomeSlider from "@/components/Film/HomeSlider";
import { fetchData } from "@/lib/fetch";

export default async function HomeSliderFetch({ trending, type, genres }) {
  const filmData = await Promise.all(
    trending.slice(0, 5).map(async (item) => {
      const filmData = await fetchData({
        endpoint: `/${type}/${item.id}`,
        queryParams: {
          append_to_response: "images",
        },
      });

      return filmData;
    }),
  );

  return (
    <HomeSlider
      films={trending.slice(0, 5)}
      genres={genres}
      filmData={filmData}
    />
  );
}
