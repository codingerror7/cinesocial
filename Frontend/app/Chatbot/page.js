import React from 'react'
import Navbar2 from '@/Components/Navbar2'
import Sidebar from '@/Components/Sidebar'
import MobileTopBar from '@/Components/MobileTopBar'

const page = () => {
  return (
    <>
    <div className='min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>
        <Navbar2 /> 
        <MobileTopBar />
        <Sidebar/>

    </div>
    </>
  )
}

export default page