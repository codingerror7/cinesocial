"use client"
import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Feed from './Feed'
import Rightpanel from './Rightpanel'

const Home = () => {
  return (
    <>
     <div className="min-h-screen w-full bg-black text-white">
      <Sidebar />

      {/* MAIN AREA */}
      <div className="ml-64 flex justify-center">

  {/* INNER CONTAINER (controls total width) */}
  <div className="flex w-full max-w-[1200px] gap-6 px-4">

    {/* FEED */}
    <div className="flex-1 min-w-0">
      <Navbar />
      <Feed />
    </div>

    {/* RIGHT PANEL */}
    <div className="w-[400px] hidden xl:block">
      <Rightpanel />
    </div>

    </div>

    </div>


    </div>
    </>
  )
}

export default Home