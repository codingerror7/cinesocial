import MovieCard from "./Moviecard";

export default function SectionRow({
  title,
  subtitle,
  data,
}) {
  return (
    <section className="mb-14 lg:mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        <button className="hidden md:block text-sm text-zinc-400 hover:text-white transition">
          View All →
        </button>
      </div>

      {/* Movie Row */}
      <div
        className="
          flex
          gap-5
          overflow-x-auto
          scrollbar-hide
          scroll-smooth
          pb-2
        "
      >
        {data?.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}