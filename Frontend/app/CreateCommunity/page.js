"use client"
import React, { useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api.js';
import { useAuth } from '@/context/AuthContext.js'

const avatars = [
  { id: "communityBanner1", url: "/communityBanner1.jpg" },
  { id: "communityBanner2", url: "/communityBanner2.jpg" },
  { id: "communityBanner3", url: "/communityBanner3.jpg" },
  { id: "communityBanner4", url: "/communityBanner4.jpg" },
  { id: "communityBanner5", url: "/communityBanner5.jpg" },
  { id: "communityBanner6", url: "/communityBanner6.jpg" },
  { id: "communityBanner7", url: "/communityBanner7.jpg" },
  { id: "communityBanner8", url: "/communityBanner8.jpg" },
  { id: "communityBanner9", url: "/communityBanner9.jpg" },
  { id: "communityBanner10", url: "/communityBanner10.jpg" },
  { id: "communityBanner11", url: "/communityBanner11.jpg" },
  { id: "communityBanner12", url: "/communityBanner12.jpg" },
  { id: "communityBanner13", url: "/communityBanner13.jpg" },
  { id: "communityBanner14", url: "/communityBanner14.jpg" }
];

const genresList = ["action","thriller","sci-fi","drama","mystery","emotional","horror","anime"];

const page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      communityBanner: "",
      tags: [],
    },
  });

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    setValue("communityBanner", avatar.url, { shouldDirty: true });
  };

  const toggleGenre = (genre) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updated);
    setValue("tags", updated, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (!storedUser?._id) {
        console.error("User not found. Please log in.");
        return;
      }

      const payload = {
        title: data.title,
        description: data.description,
        communityBanner: data.communityBanner || "",
        tags: data.tags || selectedGenres,
        userId: storedUser._id,
        username: storedUser.name || storedUser.userName || "Community Admin",
      };

      const res = await api.post("/api/create-community", payload);
      console.log(res.data);

      router.push("/Communities");
      reset();
    } catch (error) {
      console.error("Something went wrong creating community:", error);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
  
  <Sidebar />
  <Navbar2 />
  <MobileTopBar />
  <div className='py-24 sm:py-28 md:py-30 px-3 sm:px-5'>
    
    <div className="max-w-4xl mx-auto w-full">
      
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-10">
        Create Community
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto text-white w-full"
      >
        <div className="bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl md:p-8 space-y-6 sm:space-y-8 overflow-hidden">
          <input type="hidden" {...register("communityBanner", { required: true })} />
          <input type="hidden" {...register("tags")} />

          {/* COMMUNITY BANNER */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">
              Select a community banner
            </p>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shrink-0 ${
                    selectedAvatar === avatar.id
                      ? "border-white scale-105 sm:scale-110 shadow-lg"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt="community banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {errors.communityBanner && (
              <p className="text-xs text-red-400 mt-2">
                Community banner is required
              </p>
            )}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            <div>
              <label className="text-sm text-zinc-400">
                Community Name
              </label>

              <input
                type="text"
                {...register("title", { required: true, minLength: 3 })}
                placeholder="Enter community name"
                className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
              />

              {errors.title && (
                <p className="text-xs text-red-400 mt-1">
                  Community name is required
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-zinc-400">
                Description
              </label>

              <textarea
                rows="4"
                {...register("description", { required: true, minLength: 10 })}
                placeholder="Describe your community"
                className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 resize-none"
              />

              {errors.description && (
                <p className="text-xs text-red-400 mt-1">
                  Description is required and should be at least 10 characters.
                </p>
              )}
            </div>
          </div>

          {/* TAGS */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">
              Community tags
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {genresList.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition whitespace-nowrap ${
                    selectedGenres.includes(genre)
                      ? "bg-white text-black border-white"
                      : "bg-white/1 border-white/10 hover:bg-white hover:text-black"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
          
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl border border-white/20 hover:bg-white/10 transition text-sm sm:text-base"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 transition text-sm sm:text-base"
          >
            Create Community
          </button>
        </div>

      </form>
    </div>
  </div>
</div>
  )
}

export default page