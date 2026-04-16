"use client"
import React from 'react'
import Trending from './Trending'
import Suggest from './Suggest'

const Rightpanel = () => {
  return (
    <>
    <aside className='space-y-5 mt-30'>
        <Trending/>
        <Suggest/>
    </aside>
    </>
  )
}

export default Rightpanel