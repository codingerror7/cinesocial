
import { NextResponse } from "next/server";
import https from "https";

const BASE_URL = "https://api.themoviedb.org/3";

function buildUrl(path, apiKey) {
  const url = new URL(`${BASE_URL}${path}`);
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }
  return url.toString();
}

function httpsGetJson(url, headers) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        try {
          const json = JSON.parse(body || "{}");
          if (response.statusCode && response.statusCode >= 400) {
            const error = new Error(`TMDB request failed with status ${response.statusCode}`);
            error.status = response.statusCode;
            error.body = json;
            return reject(error);
          }
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });

    request.on("error", reject);
    request.end();
  });
}

export async function GET() {
  try {
    const token = process.env.TMDB_API_ACCESS_TOKEN;
    const apiKey = process.env.TMDB_API_KEY;

    if (!token && !apiKey) {
      return NextResponse.json(
        { success: false, message: "TMDB token or API key not configured" },
        { status: 500 }
      );
    }

    const useKey = Boolean(apiKey);
    const useToken = !useKey && Boolean(token);
    const headers = {
      accept: "application/json",
      ...(useToken ? { Authorization: `Bearer ${token}` } : {}),
    };

    const endpoints = [
      "/movie/popular",
      "/movie/top_rated",
      "/trending/movie/day",
      "/trending/tv/day",
    ];

    const responses = await Promise.all(
      endpoints.map((path) => httpsGetJson(buildUrl(path, useKey ? apiKey : undefined), headers))
    );

    const [popularData, topRatedData, trendingMovieData, trendingTvData] = responses;

    return NextResponse.json({
      popularMovies: popularData.results || [],
      topRatedMovies: topRatedData.results || [],
      trendingMovies: trendingMovieData.results || [],
      trendingTv: trendingTvData.results || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || String(error),
        details: error?.body || null,
      },
      { status: error?.status || 500 }
    );
  }
}
