"use client"
import React from 'react'
import Topbar from './Topbar'
import Searchbar from './Searchbar'

const Navbar = () => {
  return (
    <>
    <div className='w-[84vw] ml-[16vw] bg-gradient-to-b from-[#0e0e14] to-black flex items-center justify-between overflow-hidden px-15 py-4 fixed z-90 border-b border-white/10 font-[gilroy]'>
        <Topbar/>
        <Searchbar/>
    </div>
    </>
  )
}

export default Navbar