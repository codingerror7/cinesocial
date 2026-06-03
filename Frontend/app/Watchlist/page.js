"use client";

import React, { useEffect, useState } from "react";

import Sidebar from "@/Components/Sidebar";
import Navbar2 from "@/Components/Navbar2";
import MobileTopBar from "@/Components/MobileTopBar";
import SectionRow from "@/Components/Sectionrow";
import ExploreSkeleton from "@/Components/Skeletonloader";
import {useQuery} from "@tanstack/react-query";

const WatchlistPage = () => {

 const fetchMovies = async () => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = "https://api.themoviedb.org/3";

  const urls = [
    `${baseUrl}/movie/popular?api_key=${apiKey}`,
    `${baseUrl}/movie/top_rated?api_key=${apiKey}`,
    `${baseUrl}/trending/movie/day?api_key=${apiKey}`,
    `${baseUrl}/trending/tv/day?api_key=${apiKey}`,
  ];

  const responses = await Promise.all(
    urls.map(url => fetch(url))
  );

  const data = await Promise.all(
    responses.map(res => res.json())
  );

  return {
    popularMovies: data[0].results || [],
    topRatedMovies: data[1].results || [],
    trendingMovies: data[2].results || [],
    trendingSeries: data[3].results || [],
  };
};

  const {
  data,
  isLoading,
  error
} = useQuery({
  queryKey: ["homepageMovies"],
  queryFn: fetchMovies,
});

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
    {isLoading ? (
      <ExploreSkeleton />
    ) : (
      <>
        <SectionRow
          title="Trending Movies"
          subtitle="Most watched movies right now"
          data={data?.trendingMovies || []}
        />

        <SectionRow
          title="Trending Series"
          subtitle="Shows everyone is talking about"
          data={data?.trendingSeries || []}
        />

        <SectionRow
          title="Popular Movies"
          subtitle="Popular across the community"
          data={data?.popularMovies || []}
        />

        <SectionRow
          title="Top Rated Movies"
          subtitle="Highest rated films on TMDB"
          data={data?.topRatedMovies || []}
        />
      </>
    )}
  </div>
</main>
    </div>
  );
};

export default WatchlistPage;