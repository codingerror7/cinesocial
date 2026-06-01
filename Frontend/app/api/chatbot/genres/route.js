import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`
    );

    const data = await response.json();

    return NextResponse.json({
      genres: data.genres || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
