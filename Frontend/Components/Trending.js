"use client"
import React from 'react'

function TrendingItem({ rank, name, posts, heat, top = false }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-t border-white/10 hover:bg-white/5 transition cursor-pointer">
      
      {/* RANK */}
      <div className={`w-6 text-center font-bold text-sm ${top ? "text-red-500" : "text-white/40"}`}>
        {rank}
      </div>

      {/* THUMB */}
      <div className="w-[42px] h-[58px] rounded-md bg-white/10" />

      {/* INFO */}
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-semibold truncate">{name}</div>
        <div className="text-xs text-white/40">{posts}</div>
      </div>

      {/* HEAT */}
      <div className="text-xs text-orange-400 font-semibold">
        {heat}
      </div>

    </div>
  );
}

const Trending = () => {
  return (
    <>
     <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-sm tracking-wider font-semibold">🔥 Trending Now</div>
        <span className="text-xs text-red-400 hover:text-orange-400 cursor-pointer">
          See all
        </span>
      </div>

      {/* LIST */}
      <div>
        <TrendingItem rank="1" top name="Dune: Part Two" posts="14.2k posts today" heat="🔥 🔥 🔥" />
        <TrendingItem rank="2" top name="Oppenheimer" posts="9.8k posts today" heat="🔥 🔥" />
        <TrendingItem rank="3" name="Poor Things" posts="6.1k posts today" heat="🔥" />
        <TrendingItem rank="4" name="Shogun (2024)" posts="5.3k posts today" heat="🔥" />
        <TrendingItem rank="5" name="The Holdovers" posts="3.7k posts today" heat="📈" />
      </div>

    </div>
    </>
  )
}

export default Trending