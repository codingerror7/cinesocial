"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'
import Loader from '@/Components/Loader'
import MobileNav from '@/Components/MobileNav.js'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '@/utils/api.js';
import Image from 'next/image';

const page = () => {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("posts");

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch profile
        const profileRes = await api.get(`/api/get-profile/${id}`);
        setProfile(profileRes.data);

        // Fetch user posts
        try {
          const postsRes = await api.get(`/api/post/user/${id}`);
          let posts = postsRes.data?.posts || [];

          // fallback: if no posts found by userId, try fetching by username
          if ((!posts || posts.length === 0) && profileRes?.data?.name) {
            try {
              const fallback = await api.get(`/api/post/user-by-username/${encodeURIComponent(profileRes.data.name.toLowerCase())}`);
              posts = fallback.data?.posts || [];
            } catch (fallbackErr) {
              console.warn("Fallback fetch by username failed:", fallbackErr);
            }
          }

          setMyPosts(posts);
        } catch (postError) {
          console.error("Failed to load posts:", postError);
          setMyPosts([]);
        }

        // Fetch user communities
        try {
          const communitiesRes = await api.get(`/api/joined-communities/${id}`);
          setMyCommunities(communitiesRes.data?.joinedCommunities || []);
        } catch (communityError) {
          console.error("Failed to load communities:", communityError);
          setMyCommunities([]);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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
          <div className="w-full max-w-2xl text-center">
            <Loader message="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
  
  <Sidebar />
  <Navbar2 />
  <MobileTopBar />
  <MobileNav />
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

            <Image
              src={profile?.avatar}
              alt="choose avatar"
              width={100}
              height={100}
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
          <div className="lg:hidden w-full sm:w-auto">
            <Link
              href="/CreateCommunity"
              className="w-full sm:w-auto flex items-center justify-center px-4 py-3 sm:py-2 text-sm rounded-xl bg-white text-black border border-white/15"
            >
             Create Community
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

{/* POSTS + COMMUNITIES SECTION */}
<div className="bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl">

  {/* Toggle Tabs */}
  <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/5 w-full sm:w-fit mb-6">

    <button
      onClick={() => setActiveSection("posts")}
      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
      ${
        activeSection === "posts"
          ? "bg-white text-black shadow-lg"
          : "text-white/55 hover:text-white hover:bg-white/5"
      }`}
    >
      My Posts
    </button>

    <button
      onClick={() => setActiveSection("communities")}
      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
      ${
        activeSection === "communities"
          ? "bg-white text-black shadow-lg"
          : "text-white/55 hover:text-white hover:bg-white/5"
      }`}
    >
      My Communities
    </button>
  </div>

  {/* POSTS */}
  {activeSection === "posts" && (
    <div className="space-y-4">

      {myPosts?.length > 0 ? (
        myPosts.map((post) => (
          <div
            key={post._id}
            className="rounded-2xl border border-white/8 bg-white/[0.03]
            p-4 hover:bg-white/[0.05] transition-all duration-300"
          >

            {/* Top */}
            <div className="flex items-center justify-between gap-3">

              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {post.title || `${post.postType} Post`}
                </h3>

                <p className="text-xs text-white/35 mt-1">
                  {post.postedAt
                    ? new Date(post.postedAt).toLocaleDateString()
                    : "Recently posted"}
                </p>
              </div>

              <div className="px-3 py-1 rounded-full text-[10px] sm:text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 capitalize">
                {post.postType || "Post"}
              </div>
            </div>

            {/* Content */}
            <p className="mt-3 text-sm text-white/60 leading-relaxed line-clamp-3">
              {post.content || "No content available."}
            </p>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.media.map((mediaUrl, idx) => (
                  <img
                    key={idx}
                    src={mediaUrl}
                    alt={`media-${idx}`}
                    className="h-24 w-24 rounded-lg object-cover border border-white/10"
                  />
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center gap-4 text-xs text-white/35">

              <span>
                ❤️ {post.likesCount || 0} Likes
              </span>

              <span>
                💬 {post.commentsCount || 0} Comments
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-white/55 text-sm">
            You haven’t created any posts yet.
          </p>
        </div>
      )}
    </div>
  )}

  {/* COMMUNITIES */}
  {activeSection === "communities" && (
    <div className="space-y-4">

      {myCommunities?.length > 0 ? (
        myCommunities.map((community) => (
          <div
            key={community._id}
            className="rounded-2xl overflow-hidden border border-white/8
            bg-white/[0.03] hover:bg-white/[0.05]
            transition-all duration-300"
          >

            {/* Banner */}
            <div className="relative h-32 sm:h-40 overflow-hidden">

              <img
                src={community.communityBanner || "/avatar1.jpg"}
                alt={community.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm sm:text-lg truncate">
                    {community.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-white/50 line-clamp-2">
                    {community.description}
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs text-emerald-400 shrink-0">
                  Joined
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">

                {community.tags?.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs
                    bg-white/5 border border-white/10 text-white/65"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-white/55 text-sm">
            You haven’t joined any communities yet.
          </p>
        </div>
      )}
    </div>
  )}
</div>
    </div>
  </div>
</div>
  )
}

export default page
