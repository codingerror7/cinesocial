"use client";
import { useState, useEffect } from "react";
import GenreSelector from "./GenreSelector";
import Loader from "./Loader";

export default function ChatBot() {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/chatbot/genres");
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError("Failed to load genres");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleRecommend = async () => {
    if (selectedGenres.length === 0) {
      setError("Please select at least one genre");
      return;
    }

    setMoviesLoading(true);
    setError(null);

    try {
      const genreIds = selectedGenres.join(",");
      const response = await fetch(`/api/chatbot/movies?genres=${genreIds}`);
      const data = await response.json();

      if (data.success) {
        setMovies(data.movies || []);
      } else {
        setError(data.message || "Failed to fetch movies");
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies");
    } finally {
      setMoviesLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 mt-20">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-4xl font-bold text-center text-white">
            Discover Movies by Genre
          </h1>

          <p className="mt-3 text-center text-white/60 text-lg">
            Discover movies tailored to your interests.
          </p>

          <p className="mt-8 text-center text-white/80 text-base">
            Select one or more genres to get personalized recommendations.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 flex justify-center">
              <Loader message="Loading genres..." />
            </div>
          ) : (
            <>
              <GenreSelector
                genres={genres}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleRecommend}
                  disabled={moviesLoading}
                  className="rounded-2xl border border-white/10 bg-white px-8 py-4 font-medium text-black transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {moviesLoading ? "Fetching..." : "Recommend Movies"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length > 0 && (
        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-bold text-white mb-8">Recommended Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-3">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/avatar1.jpg"
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover transition duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
                <p className="text-xs text-white/60 mt-1">⭐ {movie.vote_average?.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {movies.length === 0 && !loading && !moviesLoading && selectedGenres.length > 0 && (
        <div className="mt-16 text-center text-white/50">
          <p>No movies found. Try selecting different genres.</p>
        </div>
      )}
    </div>
  );
}