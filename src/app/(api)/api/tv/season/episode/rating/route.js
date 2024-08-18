import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const revalidate = true;

export async function POST(req) {
  const { id, season_number, episode_number, rating } = await req.json();
  const cookiesStore = cookies();

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/rating`,
      {
        value: rating,
      },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
        },
      },
    );

    // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay 500ms

    // try {
    //   const { data } = await axios.get(
    //     `${process.env.NEXT_PUBLIC_API_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/account_states`,
    //     {
    //       params: {
    //         api_key: process.env.API_KEY,
    //         session_id: cookiesStore.get("tmdb.session_id").value,
    //       },
    //     },
    //   );

    //   return NextResponse.json(data, { status: 200 });
    // } catch (error) {
    //   return NextResponse.json(error.response.data, {
    //     status: error.response.status,
    //   });
    // }

    return NextResponse.json({ rated: { value: rating } }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const { id, season_number, episode_number, rating } = Object.fromEntries(
    url.searchParams,
  );
  const cookiesStore = cookies();

  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/rating`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
        },
      },
    );

    // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay 500ms

    // try {
    //   const { data } = await axios.get(
    //     `${process.env.NEXT_PUBLIC_API_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/account_states`,
    //     {
    //       params: {
    //         api_key: process.env.API_KEY,
    //         session_id: cookiesStore.get("tmdb.session_id").value,
    //       },
    //     },
    //   );

    //   return NextResponse.json(data, { status: 200 });
    // } catch (error) {
    //   return NextResponse.json(error.response.data, {
    //     status: error.response.status,
    //   });
    // }

    return NextResponse.json({ rated: { value: rating } }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
