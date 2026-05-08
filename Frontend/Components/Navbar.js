"use client"
import React from 'react'
import Topbar from './Topbar'
import Searchbar from './Searchbar'

const Navbar = () => {
  return (
    <>
    <div className='hidden md:flex w-[84vw] ml-[16vw] max-sm:w-full max-sm:ml-0 bg-gradient-to-b from-[#0e0e14] to-black items-center justify-between overflow-hidden px-15 py-4 fixed z-90 border-b border-white/10 font-[gilroy]'>
    <Topbar/>
    <Searchbar/>
</div>
    </>
  )
}

export default Navbar