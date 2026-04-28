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
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">

  <Sidebar />
  <Navbar />

  <div className="max-w-5xl mx-auto px-6 pt-24">

    {/* 🔹 Cover Section */}
    <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 shadow-xl">
      
      {/* Cover Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Edit Button */}
      <button className="absolute top-5 right-5 px-5 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 text-sm">
        Edit Profile
      </button>
    </div>

    {/* 🔹 Profile Section */}
    <div className="relative -mt-20 px-6">

      {/* Profile Image */}
      <div className="w-36 h-36 rounded-full border-4 border-black overflow-hidden shadow-2xl">
        <div className="w-full h-full bg-zinc-700"></div>
      </div>

      {/* User Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Sujal Saraswat</h2>
        <p className="text-zinc-400">@sujal.dev</p>
      </div>

      {/* Stats */}
      <div className="flex gap-10 mt-4 text-sm">
        <div>
          <p className="font-semibold text-lg">120</p>
          <p className="text-zinc-400">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-lg">2.3K</p>
          <p className="text-zinc-400">Followers</p>
        </div>
        <div>
          <p className="font-semibold text-lg">180</p>
          <p className="text-zinc-400">Following</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6 max-w-2xl">
        <p className="text-zinc-300 leading-relaxed">
          Full Stack Developer • React • Node • Building Cinephile 🎬  
          Passionate about crafting modern UI & interactive experiences.
        </p>
      </div>

    </div>

    {/* 🔹 Divider */}
    <div className="border-t border-white/10 my-10"></div>

    {/* 🔹 Posts Section */}
    <div>
      <h3 className="text-xl font-semibold mb-6">Posts</h3>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Post Card */}
        {[1,2,3,4,5,6].map((item) => (
          <div 
            key={item} 
            className="group relative h-52 rounded-2xl overflow-hidden bg-zinc-900 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-sm text-white/80">View Post</p>
            </div>
          </div>
        ))}

      </div>
    </div>

  </div>
</div>
    </>
  )
}

export default page