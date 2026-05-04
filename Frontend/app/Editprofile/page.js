"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Sidebar'
import Navbar2 from '@/Components/Navbar2'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext.js'

const avatars = [
  { id: "avatar1", url: "/avatar1.jpg" },
  { id: "avatar2", url: "/avatar2.jpg" },
  { id: "avatar3", url: "/avatar3.jpg" },
  { id: "avatar4", url: "/avatar4.jpg" },
  { id: "avatar5", url: "/avatar5.jpg" },
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
        const res = await axios.get(`http://localhost:8000/api/get-profile/${storedUser._id}`);
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

      const res = await axios.post("http://localhost:8000/api/create-profile", payload);
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
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative">
      <Sidebar />
      <Navbar2 />
      <div className='py-30 px-5'>          
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-10">Edit Profile</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto text-white">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
              <input type="hidden" {...register("avatar", { required: true })} />
              <input type="hidden" {...register("genres")} />

              <div>
                <p className="text-sm text-zinc-400 mb-3">Choose Avatar</p>
                <div className="flex gap-4 flex-wrap">
                  {avatars.map((avatar) => (
                    <div
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                        selectedAvatar === avatar.id
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}>
                      <img src={avatar.url} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {errors.avatar && <p className="text-xs text-red-400">Avatar is required</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-zinc-400">Title</label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Your name"
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
                  />
                  {errors.title && <p className="text-xs text-red-400">Title is required</p>}
                </div>

                <div>
                  <label className="text-sm text-zinc-400">Date of Birth</label>
                  <input
                    type="date"
                    {...register("dob", { required: true })}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
                  />
                  {errors.dob && <p className="text-xs text-red-400">DOB is required</p>}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-zinc-400">Cinematic Tag</label>
                  <input
                    type="text"
                    {...register("fantag")}
                    placeholder="like marvel fan, cinephile...(optional)"
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400">Bio</label>
                <textarea
                  rows="4"
                  {...register("bio", { required: true })}
                  placeholder="Tell something about yourself..."
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 resize-none"
                />
                {errors.bio && <p className="text-xs text-red-400">Bio is required</p>}
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-3">Favorite Genres</p>
                <div className="flex flex-wrap gap-3">
                  {genresList.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition ${
                        selectedGenres.includes(genre)
                          ? "bg-white text-black border-white"
                          : "bg-white/5 border-white/10 hover:bg-white hover:text-black"
                      }`}>
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
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