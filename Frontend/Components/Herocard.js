"use client"
import React from 'react'

const Herocard = () => {
  return (
    <>
     <div className="relative h-[200px] w-[50vw] mt-21 rounded-2xl overflow-hidden mb-7 cursor-pointer group font-[gilroy]">
      
      {/* BG Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#2d0a1a] to-[#0a1a2e]" />

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80"
        className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 transition duration-300 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-7">
        
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-red-400 uppercase w-fit mb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Now Trending
        </div>

        <h2 className="text-3xl font-bold tracking-wider">DUNE: PART TWO</h2>

        <p className="text-sm text-white/60">
          14.2k cinephiles are discussing this right now
        </p>

      </div>
    </div>
    </>
  )
}

export default Herocard