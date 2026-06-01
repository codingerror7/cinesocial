
import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Feed from './Feed'
import Trending from './AllCommunities'
import MobileNav from './MobileNav'
import MobileTopBar from './MobileTopBar'

const Home = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-black text-white">

  <MobileTopBar />
  <Navbar />
  <Sidebar />

  <main className="lg:ml-60 xl:pr-[360px]">

    <div className="max-w-4xl mx-auto px-4">
      <Feed />
    </div>

  </main>

  <Trending />

  <MobileNav />

</div>
    </>
  )
}

export default Home