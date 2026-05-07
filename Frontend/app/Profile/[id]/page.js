"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

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
        const res = await axios.get(`http://localhost:8000/api/get-profile/${id}`);
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
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
      <Sidebar />
      <Navbar2 />
      <div className="text-white flex justify-center px-4 py-30">
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-[#14151A] rounded-2xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={profile?.avatar || 'https://i.pravatar.cc/150'}
                  alt="avatar"
                  className="w-30 h-30 rounded-full object-cover border-2 border-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{profile?.title || profileName}</h2>
                <p className="text-md text-gray-400">{profileTag}</p>
                <div className="mt-4 inline-block px-3 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  {profile?.fantag || '?? Movie Lover'}
                </div>
              </div>

              <Link href="/Editprofile" className="px-4 py-2 text-sm rounded-lg bg-transparent hover:bg-purple-700 transition shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                Edit Profile
              </Link>
            </div>

            <p className="mt-4 text-gray-300 text-md leading-relaxed">
              {profile?.bio || 'Start by telling the world a little about your love for cinema.'}
            </p>

            <div className="flex gap-6 mt-5 text-md">
              <div>
                <p className="font-semibold text-white">{profile?.posts || 0}</p>
                <p className="text-gray-400">Posts</p>
              </div>
              <div>
                <p className="font-semibold text-white">{profile?.followers?.length || 0}</p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-white">{profile?.following?.length || 0}</p>
                <p className="text-gray-400">Following</p>
              </div>
            </div>
          </div>

          <div className="bg-[#14151A] rounded-2xl p-6 shadow-lg border border-white/5">
            <h3 className="text-md text-gray-400 mb-3">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {profileGenres.length > 0 ? (
                profileGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-md rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:text-purple-400 transition"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 text-md rounded-full bg-white/5 border border-white/10 text-gray-400">
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
