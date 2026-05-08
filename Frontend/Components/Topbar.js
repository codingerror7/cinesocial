"use client"
import React from 'react'

const Topbar = () => {

    /* TAB BUTTON COMPONENT */
function TabButton({ text, active = false }) {
  return (
    <button
      className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition
        ${active
          ? "bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-[0_2px_12px_rgba(239,68,68,0.5)]"
          : "text-white/60 hover:text-white"
        }`}
    >
      {text}
    </button>
  );
}

  return (
    <>
      {/* TABS */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1 lg:block hidden">
        
        <TabButton text="🔥 Trending" active />
        <TabButton text="⚡ Latest" />
        <TabButton text="👥 Following" />

      </div>
    </>
  )
}

export default Topbar