"use client"
import React from 'react'
import Sidebar from '@/Components/Sidebar'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useEffect } from 'react'

const page = () => {
  return (
    <>
    <div className='w-full min-h-screen bg-black'>
        <Sidebar/>
    </div>
    </>
  )
}

export default page