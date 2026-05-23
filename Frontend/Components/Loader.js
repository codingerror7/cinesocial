"use client"

const Loader = ({ message = "Loading...", minHeightClass = "min-h-[420px]" }) => {
  return (
    <div className={`flex items-center justify-center ${minHeightClass}`}>
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-14 w-14 rounded-full border-2 border-orange-500/20 border-t-orange-400 animate-spin"
        />
        <p className="text-sm text-white/50">{message}</p>
      </div>
    </div>
  )
}

export default Loader
