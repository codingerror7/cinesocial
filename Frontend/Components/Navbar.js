"use client"
import React from 'react'
import Searchbar from './Searchbar'
import Link from 'next/link';
import { MdMovieFilter } from "react-icons/md";
import { useAuth } from '../context/AuthContext.js';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const displayName = user?.name || user?.displayName || 'Cinephile';
  const avatarSrc = user?.avatar && user.avatar.trim() !== '' ? user.avatar : '/avatar1.jpg';

  const handleProfileClick = () => {
    const id = user?._id;
    if (id) router.push(`/Profile/${id}`);
    else router.push('/Profile/123');
  };

  return (
    <>
   <div
  className="
  hidden md:flex
  fixed top-0 right-0 z-40
  h-[78px]
  w-[calc(100%-16rem)]
  px-8 lg:px-10
  items-center justify-between
  border-b border-white/10
  bg-black/40 backdrop-blur-2xl
  shadow-[0_8px_40px_rgba(0,0,0,0.45)]
  "
>

  {/* LEFT SECTION */}
  <div className="flex items-center gap-5 flex-1">

    {/* Logo / Branding */}
    <div className="flex items-center gap-3 shrink-0">

      <div
        className="
        w-7 h-7 rounded-lg
        bg-gradient-to-br from-orange-500 via-red-500 to-pink-500
        flex items-center justify-center
        shadow-[0_0_25px_rgba(249,115,22,0.35)]
        text-lg
        "
      >
        <MdMovieFilter />
      </div>

      <div className="leading-tight">
        <h2 className="text-[15px] font-semibold tracking-wide text-white">
          CineSocial
        </h2>

        <p className="text-[11px] text-white/35">
          Social platform for cinephiles
        </p>
      </div>
    </div>

    {/* Search */}
    <div className="flex-1 max-w-xl ml-3">
      <Searchbar />
    </div>
  </div>

  {/* RIGHT SECTION */}
  <div className="flex items-center gap-3 ml-6">

    {/* About */}
    <Link href="/About">
      <button
        className="
        group relative overflow-hidden
        px-4 py-1.5 rounded-xl
        border border-white/20 text-sm text-white/75
        backdrop-blur-xl
        transition-all duration-300
        hover:bg-white/[0.06]
        hover:text-white cursor-pointer
        "
      >

        <span className="relative z-10">
          About us
        </span>
      </button>
    </Link>

    {/* Feedback */}
    <Link href="/Feedback">
      <button
        className="
        group relative overflow-hidden
        px-4 py-1.5 rounded-xl
        border border-white/20 text-sm text-white/75
        backdrop-blur-xl
        transition-all duration-300
        hover:bg-white/[0.06]
        hover:text-white cursor-pointer
        "
      >

        <span className="relative z-10">
          Feedback
        </span>
      </button>
    </Link>

    {/* Divider */}
    <div className="h-8 w-px bg-white/20 mx-1" />

    {/* User Avatar + name - clickable to profile */}
    <button
      onClick={handleProfileClick}
      title={`Open profile for ${displayName}`}
      className="flex items-center gap-3 px-3 py-1 transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      <div
        className="w-10 h-10 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 shadow-sm"
      >
        <img
          src={avatarSrc}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden md:flex flex-col items-start leading-tight">
        <span className="text-sm font-semibold text-white truncate max-w-[160px]">{displayName}</span>
        <span className="text-[11px] text-white/40">@{(displayName || 'cinephile').toLowerCase().replace(/\s+/g,'_')}</span>
      </div>
    </button>
  </div>
</div>
    </>
  )
}

export default Navbar