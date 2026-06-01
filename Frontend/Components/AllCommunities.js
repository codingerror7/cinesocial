"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import {api} from "@/utils/api.js";


const Trending = () => {
   const [communities, setCommunities] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/api/get-communities');
        const fetchedCommunities = res.data?.communities || [];
        setCommunities(fetchedCommunities);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError(err?.response?.data?.message || 'Failed to load communities');
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <>
    <div
  className="
 hidden xl:block
    fixed
    top-24
    right-8

    w-[320px]

    rounded-3xl
    border border-white/10
    bg-white/[0.02]
    backdrop-blur-xl

    p-5

    max-h-[calc(100vh-120px)]
  "
>
  {/* Header */}
  <div className="mb-5">
    <h2 className="text-lg font-semibold text-white">
      All Communities
    </h2>

    <p className="mt-1 text-xs text-white/40">
      Discover and join communities
    </p>
  </div>

  {/* Communities */}
  <div className="space-y-3
    overflow-y-auto
    scrollbar-hide
    max-h-[calc(100vh-220px)]">

    {loading ? (
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center text-sm text-white/50">
        Loading communities...
      </div>
    ) : error ? (
      <div className="rounded-2xl border border-red-500/10 bg-red-500/10 p-4 text-sm text-red-200">
        {error}
      </div>
    ) : communities.length === 0 ? (
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/40">
        No communities available.
      </div>
    ) : null}

    {communities.map((community) => (
      <div
        key={community._id}
        className="
        group
        flex items-center gap-3
        rounded-2xl
        border border-white/5
        bg-white/[0.02]
        p-2
        cursor-pointer
        transition-all duration-300
        hover:bg-white/[0.05]
        hover:border-white/10
        "
      >
        {/* Banner */}
        <div
          className="
          h-14 w-14
          overflow-hidden
          rounded-xl
          shrink-0
          "
        >
          <img
            src={community.communityBanner || "/avatar1.jpg"}
            alt={community.title}
            className="
            h-full w-full
            object-cover
            transition duration-500
            group-hover:scale-110
            "
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3
            className="
            truncate
            text-sm font-medium
            text-white
            "
          >
            {community.title}
          </h3>

          <p
            className="
            text-xs
            text-white/40
            mt-1
            "
          >
            {community.membersCount || 1} members
          </p>
        </div>
      </div>
    ))}

  </div>
</div>
    </>
  )
}

export default Trending