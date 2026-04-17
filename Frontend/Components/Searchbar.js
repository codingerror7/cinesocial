"use client"
import React from 'react'

const Searchbar = () => {
  return (
    <>
    <div>
      <form>
        <input className='w-80 border border-white/10 outline-none rounded-[20px] p-1 mr-10 font-[gilroy] text-sm' placeholder='Search..'></input>
      </form>
    </div>
    </>
  )
}

export default Searchbar