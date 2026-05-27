"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar2 from '@/Components/Navbar2'
import Sidebar from '@/Components/Sidebar'
import MobileTopBar from '@/Components/MobileTopBar'
import Loader from '@/Components/Loader'
import { api } from '@/utils/api.js'
import { useAuth } from '@/context/AuthContext.js'

const page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningCommunities, setJoiningCommunities] = useState({});

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

  const handleJoinCommunity = async (communityId) => {
    try {
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (!storedUser?._id) {
        setError('Please log in to join a community');
        return;
      }

      setJoiningCommunities(prev => ({ ...prev, [communityId]: true }));

      const res = await api.post('/api/join-community', {
        communityId,
        userId: storedUser._id
      });

      if (res.data?.success) {
        const updatedCommunity = res.data.community;
        setCommunities(prev =>
          prev.map(c =>
            c._id === communityId
              ? { ...c, membersCount: (c.membersCount || 0) + 1, slug: updatedCommunity?.slug || c.slug }
              : c
          )
        );
        setError(null);
        const destination = updatedCommunity?.slug ? `/Community/${updatedCommunity.slug}` : `/Community/${updatedCommunity._id}`;
        router.push(destination);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to join community';
      if (errMsg.includes('already')) {
        const currentCommunity = communities.find((c) => c._id === communityId);
        const destination = currentCommunity?.slug ? `/Community/${currentCommunity.slug}` : `/Community/${communityId}`;
        router.push(destination);
      } else {
        setError(errMsg);
      }
      console.error('Error joining community:', err);
    } finally {
      setJoiningCommunities(prev => {
        const next = { ...prev };
        delete next[communityId];
        return next;
      });
    }
  };

  return (
    <>
   <div
  className="min-h-screen w-full overflow-x-hidden
  bg-gradient-to-b from-[#0e0e14] via-black to-[#050505]
  text-white"
>
  
  <Navbar2 />
  <MobileTopBar />
  <Sidebar />

  {/* MAIN WRAPPER */}
  <main
    className="
    w-full
    lg:pl-[17rem]
    pt-24 sm:pt-28
    pb-14
    px-4 sm:px-6 lg:px-8
    "
  >

    {/* INNER CONTAINER */}
    <div className="max-w-7xl lg:px-15 mx-auto">

      {/* HEADING */}
      <div className="mb-8 sm:mb-10">

        <h1
          className="mt-4 text-3xl sm:text-4xl lg:text-5xl
          font-bold tracking-tight leading-tight"
        >
          Explore Communities
        </h1>

        <p
          className="mt-3 text-sm sm:text-base
          text-white/50 leading-relaxed
          max-w-2xl"
        >
          Join spaces where cinephiles discuss movies, theories,
          directors, hidden details, scenes, and storytelling.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="mb-6 rounded-2xl border border-red-500/20
          bg-red-500/10 px-4 py-3"
        >
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <Loader message="Loading communities..." />
      ) : communities.length === 0 ? (

        <div
          className="flex items-center justify-center
          min-h-[420px]"
        >
          <div className="text-center">

            <div
              className="mx-auto mb-5 flex h-20 w-20
              items-center justify-center rounded-3xl
              bg-white/[0.03] border border-white/10
              text-4xl"
            >
            </div>

            <p className="text-2xl font-semibold text-white/70">
              No communities yet
            </p>

            <p className="mt-2 text-sm text-white/40">
              Be the first to create a community.
            </p>
          </div>
        </div>

      ) : (

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          2xl:grid-cols-3
          gap-5 sm:gap-6
          "
        >

          {communities.map((community) => (

            <div
              key={community._id}
              className="
              group relative overflow-hidden
              rounded-[30px] 
              border border-white/10
              bg-black/30 backdrop-blur-2xl
              "
            >

              {/* Banner */}
              <div className="relative h-52 sm:h-56 overflow-hidden">

                <img
                  src={community.communityBanner || "/avatar1.jpg"}
                  alt={community.title}
                  className="
                  h-full w-full object-cover
                  transition-transform duration-700
                  group-hover:scale-105
                  "
                  onError={(e) => {
                    e.currentTarget.src = "/avatar1.jpg";
                  }}
                />

                {/* Overlay */}
                <div
                  className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-[#07070A]
                  via-black/20
                  to-transparent
                  "
                />

                {/* Bottom fade */}
                <div
                  className="
                  absolute bottom-0 left-0 right-0
                  h-28
                  bg-gradient-to-t from-[#07070A] to-transparent
                  "
                />
              </div>

              {/* CONTENT */}
              <div
                className="
                relative z-10
                px-5 sm:px-6
                pb-6
                -mt-10
                "
              >

          

                {/* TITLE + BUTTON */}
                <div
                  className="
                  mt-13 flex items-start justify-between gap-3
                  "
                >

                  <div className="min-w-0 flex-1">

                    <h2
                      className="
                      truncate
                      text-[20px] font-semibold tracking-tight
                      text-white uppercase
                      "
                    >
                      {community.title}
                    </h2>

                    <p className="mt-1 text-xs text-white/40">
                      {community.membersCount || 1}{" "}
                      {(community.membersCount || 1) === 1
                        ? "member"
                        : "members"}
                    </p>
                  </div>

                  {/* JOIN BUTTON */}
                  <button
                    onClick={() =>
                      handleJoinCommunity(community._id)
                    }
                    disabled={joiningCommunities[community._id]}
                    className="
                    shrink-0 rounded-xl
                    px-4 py-2
                    text-sm font-medium text-white
                    bg-transaprent border border-white/20
                    hover:bg-white hover:text-black
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-all duration-300
                    hover:scale-[1.04]
                    "
                  >
                    {joiningCommunities[community._id]
                      ? "Joining..."
                      : "Join"}
                  </button>
                </div>

                {/* DESCRIPTION */}
                <p
                  className="
                  mt-4 line-clamp-3
                  text-sm leading-relaxed
                  text-white/55
                  "
                >
                  {community.description}
                </p>

                {/* TAGS */}
                <div className="mt-5 flex flex-wrap gap-2">

                  {community.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="
                      rounded-full
                      border border-orange-500/15
                      bg-transparent
                      px-3 py-1
                      text-[11px] font-medium
                      text-orange-300
                      backdrop-blur-md
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div
                  className="
                  mt-5 h-[1px] w-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                  "
                />

                {/* FOOTER */}
                <div
                  className="
                  mt-5 flex items-center justify-between gap-3
                  "
                >

                  {/* Admin */}
                  <div
                    className="
                    flex min-w-0 items-center gap-3
                    "
                  >

                    <div
                      className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full overflow-hidden
                      shrink-0
                      border border-white/10
                      "
                    >
                      {community.admin?.avatar ? (
                        <img
                          src={community.admin.avatar}
                          alt={community.admin.username || "Admin"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{community.admin?.username?.charAt(0) || "C"}</span>
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] text-white/35">
                        Created by
                      </p>

                      <p
                        className="
                        truncate text-sm text-white/80
                        "
                      >
                        {community.admin?.username || "Admin"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className="
                    shrink-0 rounded-full
                    border border-emerald-500/20
                    bg-emerald-500/10
                    px-3 py-1
                    text-[11px] text-emerald-400
                    "
                  >
                    Active
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>
</div>
    </>
  )
}

export default page