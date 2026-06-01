"use client";

export default function GenreSelector({ genres, selectedGenres, setSelectedGenres }) {
  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        return (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`
              rounded-full
              border
              px-5
              py-3
              text-sm
              font-medium
              transition-all
              duration-300
              ${
                isSelected
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:border-white/30"
              }
            `}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}