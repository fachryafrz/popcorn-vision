"use server";

import axios from "axios";

export async function getFilms({ endpoint, params }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      params: {
        api_key: process.env.API_KEY,
        ...params,
      },
    }
  );

  return data;
}

export async function getFilm({ id, type, path, params }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}${path}`,
    {
      params: {
        api_key: process.env.API_KEY,
        language: "en",
        ...params,
      },
    }
  );

  return data;
}

export async function getTrending({ num, type }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/trending/${type}/day`,
    {
      params: {
        api_key: process.env.API_KEY,
      },
    }
  );

  if (num) {
    return data.results[num - 1];
  } else {
    return data;
  }
}

export async function getGenres({ type }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/genre/${type}/list`,
    {
      params: {
        api_key: process.env.API_KEY,
      },
    }
  );

  return data.genres;
}

export async function getTitleLogo({ film, isTvPage }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/${!isTvPage ? `movie` : `tv`}/${
      film.id
    }/images`,
    {
      params: {
        api_key: process.env.API_KEY,
        language: "en",
      },
    }
  );

  return data.logos[0];
}

export async function getFilmSeason({ film }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tv/${film.id}`,
    {
      params: {
        api_key: process.env.API_KEY,
      },
    }
  );

  return data.number_of_seasons;
}

export async function getFilmCollection({ film }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/${film.belongs_to_collection.id}`,
    {
      params: {
        api_key: process.env.API_KEY,
      },
    }
  );

  return data;
}

export async function getEpisodes({ id, season }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tv/${id}/season/${season}`,
    {
      params: {
        api_key: process.env.API_KEY,
      },
    }
  );

  return data.episodes;
}

export async function getLocation({ latitude, longitude }) {
  const { data } = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  return data;
}

export async function getPerson({ id, path }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/person/${id}${path}`,
    {
      params: {
        api_key: process.env.API_KEY,
        language: "en",
      },
    }
  );

  return data;
}

export async function getMoreReviews({ film, type, currentPage }) {
  const nextPage = currentPage + 1;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/${type}/${film.id}/reviews`,
    {
      params: {
        api_key: process.env.API_KEY,
        page: nextPage,
      },
    }
  );

  return data;
}

export async function getEpisodeModal({ filmID, season, eps }) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tv/${filmID}/season/${season}/episode/${eps}`,
      {
        params: {
          api_key: process.env.API_KEY,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(`Errornya episode modal: ${error}`);
  }
}
