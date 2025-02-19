import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { data, status } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/token/new`,
      { params: { api_key: process.env.API_KEY } },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error.response

    return NextResponse.json(data, { status });
  }
}
