"use client"
import React from 'react'

const MobileTopBar = () => {
  return (
    <>
    <div className='w-full lg:hidden bg-gradient-to-b from-[#0e0e14] to-black flex items-center justify-between overflow-hidden px-3 py-3 fixed z-90 border-b border-white/10 font-[gilroy] top-0 mb-10'>
     {/* LOGO */}
      <div className="py-1 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-md bg-gradient-to-br from-red-500 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          🎬
        </div>
        <div className="text-[20px] tracking-[2px] font-bold bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
          CineSocial
        </div>
      </div>
    </div>
    </>
  )
}

export default MobileTopBar