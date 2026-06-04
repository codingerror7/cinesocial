"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api.js';
import { useAuth } from '@/context/AuthContext.js'
import Image from 'next/image'

const avatars = [
  { id: "avatar1", url: "/avatar1.jpg" },
  { id: "avatar2", url: "/avatar2.jpg" },
  { id: "avatar3", url: "/avatar3.jpg" },
  { id: "avatar4", url: "/avatar4.jpg" },
  { id: "avatar5", url: "/avatar5.jpg" },
  { id: "avatar6", url: "/avatar6.jpg" },
  { id: "avatar7", url: "/avatar7.jpg" },
  { id: "avatar8", url: "/avatar8.jpg" },
  { id: "avatar9", url: "/avatar9.jpg" },
  { id: "avatar10", url: "/avatar10.jpg" },
  { id: "avatar11", url: "/avatar11.jpg" },
  { id: "avatar12", url: "/avatar12.jpg" },
  { id: "avatar13", url: "/avatar13.jpg" },
  { id: "avatar14", url: "/avatar14.jpg" },
  { id: "avatar15", url: "/avatar15.jpg" },
  { id: "avatar16", url: "/avatar16.jpg" },
  { id: "avatar17", url: "/avatar17.jpg" },
  { id: "avatar18", url: "/avatar18.jpg" },
  { id: "avatar19", url: "/avatar19.jpg" },
  { id: "avatar20", url: "/avatar20.jpg" },
  { id: "avatar21", url: "/avatar21.jpg" },
  { id: "avatar22", url: "/avatar22.jpg" },
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
      dob: "",
      fantag: "",
      bio: "",
      avatar: "",
      genres: [],
    },
  });

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
    if (!storedUser?._id) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/get-profile/${storedUser._id}`);
        const profile = res.data;
        const profileGenres = Array.isArray(profile.genre)
          ? profile.genre
          : profile.genre
            ? [profile.genre]
            : [];

        reset({
          title: profile.title || "",
          dob: profile.dob ? profile.dob.slice(0, 10) : "",
          fantag: profile.fantag || "",
          bio: profile.bio || "",
          avatar: profile.avatar || "",
          genres: profileGenres,
        });
        setSelectedAvatar(avatars.find((a) => a.url === profile.avatar)?.id || null);
        setSelectedGenres(profileGenres);
      } catch (error) {
        console.error("Could not load profile:", error);
      }
    };

    fetchProfile();
  }, [user, reset]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    setValue("avatar", avatar.url, { shouldDirty: true });
  };

  const toggleGenre = (genre) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updated);
    setValue("genres", updated, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (!storedUser?._id) {
        console.error("User not found. Please log in.");
        return;
      }

      const payload = {
        ...data,
        genres: data.genres || selectedGenres,
        userId: storedUser._id,
      };

      const res = await api.post("/api/create-profile", payload);
      console.log(res.data);

      const updatedUser = {
        ...storedUser,
        title: data.title,
        avatar: data.avatar,
        bio: data.bio,
        fantag: data.fantag,
        genre: payload.genres,
        dob: data.dob,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      router.push(`/Profile/${storedUser._id}`);
      reset();
    } catch (error) {
      console.error("Something went wrong in create-profile frontend:", error);
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
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto text-white w-full"
      >
        <div className="bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl md:p-8 space-y-6 sm:space-y-8 overflow-hidden">
          
          <input type="hidden" {...register("avatar", { required: true })} />
          <input type="hidden" {...register("genres")} />

          {/* AVATARS */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">
              Choose Avatar
            </p>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-300 shrink-0 ${
                    selectedAvatar === avatar.id
                      ? "border-white scale-105 sm:scale-110 shadow-lg"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={avatar.url}
                    alt="avatar"
                    width={100}
                    height={100}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {errors.avatar && (
              <p className="text-xs text-red-400 mt-2">
                Avatar is required
              </p>
            )}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* TITLE */}
            <div>
              <label className="text-sm text-zinc-400">
                Title
              </label>

              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Your name"
                className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/1 border border-white/10 focus:outline-none focus:border-white/30"
              />

              {errors.title && (
                <p className="text-xs text-red-400 mt-1">
                  Title is required
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm text-zinc-400">
                Date of Birth
              </label>

              <input
                type="date"
                {...register("dob", { required: true })}
                className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/1 border border-white/10 focus:outline-none focus:border-white/30"
              />

              {errors.dob && (
                <p className="text-xs text-red-400 mt-1">
                  DOB is required
                </p>
              )}
            </div>

            {/* TAG */}
            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-400">
                Cinematic Tag
              </label>

              <input
                type="text"
                {...register("fantag")}
                placeholder="like marvel fan, cinephile...(optional)"
                className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/1 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="text-sm text-zinc-400">
              Bio
            </label>

            <textarea
              rows="4"
              {...register("bio", { required: true })}
              placeholder="Tell something about yourself..."
              className="mt-2 w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/1 border border-white/10 focus:outline-none focus:border-white/30 resize-none"
            />

            {errors.bio && (
              <p className="text-xs text-red-400 mt-1">
                Bio is required
              </p>
            )}
          </div>

          {/* GENRES */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">
              Favorite Genres
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
            Save Changes
          </button>
        </div>

      </form>
    </div>
  </div>
</div>
  )
}

export default page