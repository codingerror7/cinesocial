"use client"
import React from 'react'

const Navbar2 = () => {
  return (
    <>
    <div className='w-[84vw] ml-[16vw] lg:block hidden bg-gradient-to-b from-[#0e0e14] to-black flex items-center justify-between overflow-hidden px-15 py-4 fixed z-40 border-b border-white/10 font-[gilroy]'>
     {/* LOGO */}
      <div className="px-2 py-2 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-red-500 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          🎬
        </div>
        <div className="text-[22px] tracking-[2px] font-bold bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
          CineSocial
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar2