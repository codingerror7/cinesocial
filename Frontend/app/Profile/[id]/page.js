"use client"
import React from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar from '@/Components/Navbar'
import Link from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useEffect } from 'react'

const page = () => {
  return (
    <>
    <div className='w-full min-h-screen bg-black'>
        <Sidebar/>
        <Navbar/>
        <div className="w-[1000px] h-200 mx-auto px-6 overflow-x-hidden border border-white/10">
        <div className='h-50 mt-20 flex items-center gap-20 border border-white'>
            <div className='w-170 h-50 border border-white'></div>
            <button className='w-40 border border-white/40 rounded-xl px-5 text-white font-[gilroy] text-md text-center mb-30 hover:bg-white hover:text-black cursor-pointer'>Edit Profile</button>
        </div>
        <div className='border border-white w-40 h-40 rounded-[50%] absolute top-60 left-80'></div>
        <div className='border border-white w-200 px-3 h-40 mt-35'>
            <p className='text-white'>bio</p>
        </div>
        </div>
    </div>
    </>
  )
}

export default page