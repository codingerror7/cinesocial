
import React from 'react'
import Trending from './Trending'
import Suggest from './Suggest'

const Rightpanel = () => {
  return (
    <>
    <aside className='space-y-8 mt-30 mr-12 lg:block hidden'>
        <Trending/>
        <Suggest/>
    </aside>
    </>
  )
}

export default Rightpanel