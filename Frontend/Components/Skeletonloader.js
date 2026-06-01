export default function ExploreSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-10 h-8 w-60 rounded bg-zinc-800" />

      <div className="flex gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[280px] w-[180px] rounded-xl bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}