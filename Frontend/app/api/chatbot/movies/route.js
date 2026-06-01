import { NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genres = searchParams.get("genres");

    if (!genres) {
      return NextResponse.json(
        { success: false, message: "Genre IDs are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genres}&language=en-US&sort_by=popularity.desc&page=1`
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      movies: data.results || [],
    });
  } catch (error) {
    console.error("Movies fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
