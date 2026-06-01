"use client";

import React, { useEffect, useState } from "react";

import Sidebar from "@/Components/Sidebar";
import Navbar2 from "@/Components/Navbar2";
import MobileTopBar from "@/Components/MobileTopBar";
import SectionRow from "@/Components/Sectionrow";
import ExploreSkeleton from "@/Components/Skeletonloader";

const WatchlistPage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const baseUrl = "https://api.themoviedb.org/3";
    const headers = { accept: "application/json" };

    try {
      if (!apiKey) {
        const res = await fetch("/api/tmdb");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load TMDB data");
        }

        setPopularMovies(json.popularMovies || []);
        setTopRatedMovies(json.topRatedMovies || []);
        setTrendingMovies(json.trendingMovies || []);
        setTrendingSeries(json.trendingTv || []);
        return;
      }

      const urls = [
        `${baseUrl}/movie/popular?api_key=${apiKey}`,
        `${baseUrl}/movie/top_rated?api_key=${apiKey}`,
        `${baseUrl}/trending/movie/day?api_key=${apiKey}`,
        `${baseUrl}/trending/tv/day?api_key=${apiKey}`,
      ];

      const responses = await Promise.all(urls.map((url) => fetch(url, { headers })));
      const jsonData = await Promise.all(responses.map((res) => res.json()));

      if (responses.some((res) => !res.ok)) {
        const bad = responses.find((res) => !res.ok);
        const badBody = jsonData[responses.indexOf(bad)];
        throw new Error(badBody?.status_message || `TMDB request failed: ${bad.status}`);
      }

      setPopularMovies(jsonData[0].results || []);
      setTopRatedMovies(jsonData[1].results || []);
      setTrendingMovies(jsonData[2].results || []);
      setTrendingSeries(jsonData[3].results || []);
    } catch (error) {
      setError(error?.message || "Unable to load movies from TMDB");
      console.error("TMDB Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden
      bg-gradient-to-b from-[#0e0e14] via-black to-[#050505]
      text-white"
    >
      <Navbar2 />
      <MobileTopBar />
      <Sidebar />

     <main className="lg:ml-[260px] pt-24 lg:pt-8 px-4 md:px-8 pb-16">
  <div className="max-w-[1600px] mx-auto">


    {/* Error State */}
    {error && (
      <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        <strong>TMDB Error:</strong> {error}
      </div>
    )}

    {/* Loading */}
    {loading ? (
      <ExploreSkeleton />
    ) : (
      <>
        <SectionRow
          title="Trending Movies"
          subtitle="Most watched movies right now"
          data={trendingMovies}
        />

        <SectionRow
          title="Trending Series"
          subtitle="Shows everyone is talking about"
          data={trendingSeries}
        />

        <SectionRow
          title="Popular Movies"
          subtitle="Popular across the community"
          data={popularMovies}
        />

        <SectionRow
          title="Top Rated Movies"
          subtitle="Highest rated films on TMDB"
          data={topRatedMovies}
        />
      </>
    )}
  </div>
</main>
    </div>
  );
};

export default WatchlistPage;