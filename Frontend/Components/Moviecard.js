export default function MovieCard({ item }) {
  const image = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/avatar1.jpg";

  const title = item.title || item.name;

  const releaseYear =
    item.release_date?.split("-")[0] ||
    item.first_air_date?.split("-")[0] ||
    "N/A";

  return (
    <div className="group relative min-w-[180px] max-w-[180px] cursor-pointer">
      {/* Poster */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 shadow-lg transition-all duration-300">

        <img
          src={image}
          alt={title}
          className="h-[270px] w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 rounded-full bg-black/80 backdrop-blur-md px-2 py-1 text-xs font-semibold text-yellow-400 border border-white/10">
          ⭐ {item.vote_average?.toFixed(1)}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs text-zinc-400">
            {releaseYear}
          </p>
        </div>
      </div>
    </div>
  );
}