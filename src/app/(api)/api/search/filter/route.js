import axios from "axios";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const {
    media_type,
    page,
    status,
    release_date,
    watch_providers,
    watch_region,
    with_genres,
    with_networks,
    with_cast,
    with_crew,
    with_companies,
    with_original_language,
    with_keywords,
    with_runtime,
    vote_count,
    type,
    sort_by,
    o,
  } = Object.fromEntries(url.searchParams);

  const params = {
    api_key: process.env.API_KEY,
    include_adult: false,
  };

  // Applying filters
  if (page) params.page = page;
  if (status) params.with_status = status;
  if (release_date) {
    const [min, max] = release_date.split("..");
    if (media_type === "movie") {
      params["primary_release_date.gte"] = min;
      params["primary_release_date.lte"] = max;
    } else {
      params["first_air_date.gte"] = min;
      params["first_air_date.lte"] = max;
    }
  }
  if (watch_providers) {
    params.with_watch_providers = watch_providers;
    params.watch_region = watch_region;
  }
  if (with_genres) params.with_genres = with_genres;
  if (with_networks) params.with_networks = with_networks;
  if (with_cast) params.with_cast = with_cast;
  if (with_crew) params.with_crew = with_crew;
  if (with_companies) params.with_companies = with_companies;
  if (with_original_language) {
    params.with_original_language = with_original_language;
  }
  if (with_keywords) params.with_keywords = with_keywords;
  if (with_runtime) {
    const [min, max] = with_runtime.split("..");
    params["with_runtime.gte"] = min;
    params["with_runtime.lte"] = max;
  }
  if (vote_count) {
    const [min, max] = vote_count.split("..");
    params["vote_count.gte"] = min;
    params["vote_count.lte"] = max;
  }
  if (type) params.with_type = type;
  if (sort_by) params.sort_by = sort_by;
  if (o) {
    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    const monthsAgo = moment().subtract(1, "months").format("YYYY-MM-DD");
    const monthsLater = moment().add(1, "months").format("YYYY-MM-DD");

    params.without_genres = 18;

    if (o === "now_playing" || o === "on_the_air") {
      if (media_type === "movie") {
        params["primary_release_date.gte"] = monthsAgo;
        params["primary_release_date.lte"] = today;
      } else {
        params["first_air_date.gte"] = monthsAgo;
        params["first_air_date.lte"] = today;
      }
    }

    if (o === "upcoming") {
      if (media_type === "movie") {
        params["primary_release_date.gte"] = tomorrow;
        params["primary_release_date.lte"] = monthsLater;
      } else {
        params["first_air_date.gte"] = tomorrow;
        params["first_air_date.lte"] = monthsLater;
      }
    }
  }

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/discover/${media_type}`,
      {
        params: params,
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}