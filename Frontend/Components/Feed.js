"use client"
import React from 'react'
import Herocard from './Herocard'
import Postcard from './Postcard'

const Feed = () => {
  return (
    <>
     <div className="w-[800px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 overflow-x-hidden">
      
      {/* LEFT FEED */}
      <div>
        <Herocard />

        <div className="space-y-5">
          <Postcard key="postcard-1" variant="default" />
          <Postcard key="postcard-2" variant="spoiler" />
          <Postcard key="postcard-3" variant="default" />
          <Postcard key="postcard-4" variant="default" />
        </div>
      </div>

      {/* RIGHT PANEL placeholder (already handled separately) */}
      <div className="hidden xl:block"></div>
      
    </div>
    </>
  )
}

export default Feed