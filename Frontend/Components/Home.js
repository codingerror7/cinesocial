
import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Feed from './Feed'
import Rightpanel from './Rightpanel'
import MobileNav from './MobileNav'
import MobileTopBar from './MobileTopBar'

const Home = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-black text-white">
      
      <MobileTopBar />
      <Navbar />
      <Sidebar />

      {/* MAIN AREA */}
      <div className="ml-0 lg:ml-64 flex">

        {/* CENTER FEED */}
        <div className="flex-1 max-w-3xl mx-auto px-2">
          <Feed />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[420px] hidden xl:block px-6">
          <Rightpanel />
        </div>

      </div>

      {/* MOBILE NAV */}
      <MobileNav />

    </div>
    </>
  )
}

export default Home