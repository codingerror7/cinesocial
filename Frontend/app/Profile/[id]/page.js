"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '@/utils/api.js';

const page = () => {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/get-profile/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params]);

  const profileGenres = profile
    ? Array.isArray(profile.genre)
      ? profile.genre
      : profile.genre
        ? [profile.genre]
        : []
    : [];

  const profileName = profile?.name || "Cinephile";
  const profileTag = profile?.fantag
    ? `@${profile.fantag.replace(/\s+/g, '_')}`
    : `@${profileName.toLowerCase().replace(/\s+/g, '_')}`;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
        <Sidebar />
        <Navbar2 />
        <div className="text-white flex justify-center px-4 py-30">
          <div className="w-full max-w-2xl text-center text-white/70">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
  
  <Sidebar />
  <Navbar2 />
  <MobileTopBar />

  {/* MAIN */}
  <div className="text-white flex justify-center px-3 sm:px-4 pt-24 sm:pt-28 md:pt-30 pb-24">
    
    <div className="w-full max-w-2xl space-y-5 sm:space-y-6">
      
      {/* PROFILE CARD */}
      <div className="relative overflow-hidden bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl">
        
        {/* subtle glow */}
        <div className="absolute top-[-50px] right-[-40px] w-[140px] h-[140px] rounded-full bg-red-500/10 blur-3xl" />

        {/* TOP SECTION */}
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          
          {/* AVATAR */}
          <div className="relative mx-auto sm:mx-0 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl scale-110" />

            <img
              src={profile?.avatar || 'https://i.pravatar.cc/150'}
              alt="avatar"
              className="relative w-24 h-24 sm:w-30 sm:h-30 rounded-full object-cover border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            
            <h2 className="text-xl sm:text-2xl font-semibold truncate">
              {profile?.title || profileName}
            </h2>

            <p className="text-sm sm:text-md text-gray-400 mt-1 truncate">
              {profileTag}
            </p>

            <div className="mt-4 inline-flex items-center justify-center sm:justify-start px-3 py-1 text-[11px] sm:text-xs rounded-full bg-white/10 text-white/80 border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.12)] max-w-full">
              <span className="truncate">
                {profile?.fantag || '?? Movie Lover'}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <div className="w-full sm:w-auto">
            <Link
              href="/Editprofile"
              className="w-full sm:w-auto flex items-center justify-center px-4 py-3 sm:py-2 text-sm rounded-xl bg-white/5 hover:bg-white transition shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-black border border-white/15"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* BIO */}
        <p className="mt-5 text-gray-300 text-sm sm:text-md leading-relaxed text-center sm:text-left break-words">
          {profile?.bio || 'Start by telling the world a little about your love for cinema.'}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-6 mt-6">
          
          <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-2 text-center sm:bg-transparent sm:border-none sm:p-0">
            <p className="font-semibold text-white text-lg sm:text-base">
              {profile?.posts || 0}
            </p>

            <p className="text-gray-400 text-xs sm:text-md">
              Posts
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-2 text-center sm:bg-transparent sm:border-none sm:p-0">
            <p className="font-semibold text-white text-lg sm:text-base">
              {profile?.followers?.length || 0}
            </p>

            <p className="text-gray-400 text-xs sm:text-md">
              Followers
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-2 text-center sm:bg-transparent sm:border-none sm:p-0">
            <p className="font-semibold text-white text-lg sm:text-base">
              {profile?.following?.length || 0}
            </p>

            <p className="text-gray-400 text-xs sm:text-md">
              Following
            </p>
          </div>
        </div>
      </div>

      {/* GENRES */}
      <div className="bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl">
        
        <h3 className="text-sm sm:text-md text-gray-400 mb-4">
          Favorite Genres
        </h3>

        <div className="flex flex-wrap gap-2">
          {profileGenres.length > 0 ? (
            profileGenres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-white/5 border border-white/10 hover:border-white hover:text-gray-100 transition hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-white/5 border border-white/10 text-gray-400">
              No favorite genres selected yet.
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default page
