import { releaseStatus } from "@/lib/releaseStatus";
import { axios } from "@/lib/axios";
import { siteConfig } from "@/config/site";
import ClientFilmDetail from "@/components/Film/Details/ClientFilmDetail";

export async function generateMetadata({ params, type = "movie" }) {
  const { id } = params;

  const [film, images] = await Promise.all([
    axios.get(`/${type}/${id}`).then(({ data }) => data),

    axios
      .get(`/${type}/${id}/images`, {
        params: {
          include_image_language: "en",
        },
      })
      .then(({ data }) => data),
  ]);
  const isTvPage = type !== "movie" ? true : false;

  const filmReleaseDate = film.release_date
    ? new Date(film.release_date).getFullYear()
    : releaseStatus(film.status);

  let backdrops;

  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    backdrops = {
      images: `https://image.tmdb.org/t/p/w500${path}`,
    };
  }

  return {
    title: `${film.title} (${filmReleaseDate})`,
    description: film.overview,
    openGraph: {
      title: `${film.title} (${filmReleaseDate})`,
      description: film.overview,
      url: `${siteConfig.url}/${`movies`}/${film.id}`,
      siteName: siteConfig.name,
      ...backdrops,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function FilmDetail({ params, type = "movie" }) {
  const { id } = params;

  return <ClientFilmDetail id={id} type={type} />;
}

