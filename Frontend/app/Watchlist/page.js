import React from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'

const page = () => {
  return (
    <>
    <div className="min-h-screen w-full overflow-x-hidden
  bg-gradient-to-b from-[#0e0e14] via-black to-[#050505]
  text-white">
        <Navbar2 />
        <MobileTopBar />
        <Sidebar />
    </div>
    </>
  )
}

export default page