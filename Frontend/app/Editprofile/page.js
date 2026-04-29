"use client"
import React from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import Link from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useEffect } from 'react'

const avatars = [
  { id: "avatar1", url: "/avatars/a1.png" },
  { id: "avatar2", url: "/avatars/a2.png" },
  { id: "avatar3", url: "/avatars/a3.png" },
  { id: "avatar4", url: "/avatars/a4.png" },
  { id: "avatar5", url: "/avatars/a5.png" },
];

const page = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);

  return (
    <>
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
    <Sidebar />
    <Navbar2 />
     <div className='py-30 px-5'>
        <div className="max-w-4xl mx-auto">

        {/* 🔹 Header */}
        <h1 className="text-3xl font-semibold mb-10">Edit Profile</h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">

          {/* 🔹 Cover Photo */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Cover Photo</p>

            <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">Upload Cover</span>

              <button className="absolute bottom-3 right-3 px-4 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white hover:text-black transition">
                Change
              </button>
            </div>
          </div>

          {/* 🔹 Avatar Selection */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Choose Avatar</p>

            <div className="flex gap-4 flex-wrap">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-300
                    ${
                      selectedAvatar === avatar.id
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={avatar.url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Basic Info */}
          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Date of Birth</label>
              <input
                type="date"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>

          </div>

          {/* 🔹 Bio */}
          <div>
            <label className="text-sm text-zinc-400">Bio</label>
            <textarea
              rows="4"
              placeholder="Tell something about yourself..."
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* 🔹 Genre Selection (Add-on Feature) */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Favorite Genres</p>

            <div className="flex flex-wrap gap-3">
              {["Action", "Drama", "Sci-Fi", "Horror", "Romance", "Comedy"].map((genre) => (
                <button
                  key={genre}
                  className="px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 hover:bg-white hover:text-black transition"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
            Cancel
          </button>

          <button className="px-6 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 transition">
            Save Changes
          </button>
        </div>

      </div>
     </div>
    </div>
    </>
  )
}

export default page