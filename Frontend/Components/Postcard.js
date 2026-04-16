"use client"
import React from 'react'

const Postcard = ({variant = "default"}) => {
    function ActionBtn({ icon, count, active = false }) {
  return (
    <button
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition
        ${active 
          ? "text-red-500 hover:bg-red-500/10" 
          : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
    >
      <span>{icon}</span>
      <span className="text-xs">{count}</span>
    </button>
  );
}
  return (
    <>
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] hover:-translate-y-[2px] cursor-pointer">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-purple-500 to-red-500 border border-purple-400/30">
          RV
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold">Rahul Verma</div>
          <div className="text-xs text-white/40">@cinephile_rahul · 2h ago</div>
        </div>

        <div className="text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
          🎬 Dune: Part Two
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 pb-4">
        <p className="text-sm leading-relaxed text-white/90">
          Villeneuve has done it again. The sandworm riding sequence is one of the most viscerally breathtaking things I've seen in a theater this decade.
        </p>

        {/* SPOILER BLOCK */}
        {variant === "spoiler" && (
          <div className="mt-3 p-3 border border-white/10 bg-white/5 rounded-md relative">
            
            <div className="text-[10px] mb-2 px-2 py-1 inline-block rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase font-bold">
              ⚠️ Spoiler
            </div>

            <p className="text-xs text-white/60 blur-sm">
              The final conversation between Oppenheimer and Einstein...
            </p>

            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
              👁 Tap to reveal spoiler
            </div>

          </div>
        )}
      </div>

      {/* MOVIE CARD */}
      <div className="mx-4 mb-4 flex gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
        
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=120&q=80"
          className="w-[60px] h-[88px] rounded-md object-cover"
        />

        <div className="flex-1">
          <div className="text-sm font-bold">Dune: Part Two</div>
          <div className="text-xs text-white/40">2024 · Sci-Fi · Denis Villeneuve</div>

          <div className="mt-2 text-xs px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 w-fit">
            ⭐ 8.8 / 10
          </div>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        
        <ActionBtn icon="❤️" count="2.4k" active />
        <ActionBtn icon="💬" count="318" />
        <ActionBtn icon="🔄" count="94" />

        <div className="flex-1" />

        <button className="text-sm text-white/60 hover:text-white">
          🔖
        </button>
      </div>

    </div>
    </>
  )
}

export default Postcard