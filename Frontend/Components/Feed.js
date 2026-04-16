"use client"
import React from 'react'
import Herocard from './Herocard'
import Postcard from './Postcard'

const Feed = () => {
  return (
    <>
     <div className="max-w-[1100px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 overflow-x-hidden">
      
      {/* LEFT FEED */}
      <div>
        <Herocard />

        <div className="space-y-5">
          <Postcard variant="default" />
          <Postcard variant="spoiler" />
          <Postcard variant="default" />
          <Postcard variant="default" />
        </div>
      </div>

      {/* RIGHT PANEL placeholder (already handled separately) */}
      <div className="hidden xl:block"></div>
      
    </div>
    </>
  )
}

export default Feed