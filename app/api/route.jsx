"use server";

import axios from "axios";

export async function fetchData({
  endpoint,
  queryParams = {},
  method = "GET",
}) {
  try {
    const { data } = await axios.request({
      method: method,
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: endpoint,
      params: { api_key: process.env.API_KEY, ...queryParams },

      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
}

export async function getFilm({ id, type, path, params }) {
  const res = await fetchData({
    endpoint: `/${type}/${id}${path}`,
    queryParams: {
      language: "en",
      ...params,
    },
  });

  return res;
}

export async function getTrending({ num, type }) {
  const res = await fetchData({
    endpoint: `/trending/${type}/day`,
  });

  if (num) {
    return res.results[num - 1];
  } else {
    return res;
  }
}

export async function getGenres({ type }) {
  const res = await fetchData({
    endpoint: `/genre/${type}/list`,
  });

  return res.genres;
}

export async function getTitleLogo({ film, isTvPage }) {
  const res = await fetchData({
    endpoint: `/${!isTvPage ? `movie` : `tv`}/${film.id}/images`,
    queryParams: {
      include_image_language: "en",
    },
  });

  return res.logos[0];
}

export async function getFilmSeason({ film }) {
  const res = await fetchData({
    endpoint: `/tv/${film.id}`,
  });

  return res.number_of_seasons;
}

export async function getFilmCollection({ film }) {
  const res = await fetchData({
    endpoint: `/collection/${film.belongs_to_collection.id}`,
  });

  return res;
}

export async function getEpisodes({ id, season }) {
  const res = await fetchData({
    endpoint: `/tv/${id}/season/${season}`,
  });

  return res.episodes;
}

export async function getLocation({ latitude, longitude }) {
  const { data } = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  return data;
}

export async function getPerson({ id, path }) {
  const res = await fetchData({
    endpoint: `/person/${id}${path}`,
    queryParams: {
      language: "en",
      append_to_response: `combined_credits,movie_credits,tv_credits,images`,
    },
  });

  return res;
}

export async function getMoreReviews({ film, type, currentPage }) {
  const nextPage = currentPage + 1;

  const res = await fetchData({
    endpoint: `/${type}/${film.id}/reviews`,
    queryParams: {
      page: nextPage,
    },
  });

  return res;
}

export async function getEpisodeModal({ filmID, season, eps }) {
  const res = await fetchData({
    endpoint: `/tv/${filmID}/season/${season}/episode/${eps}`,
  });

  return res;
}
