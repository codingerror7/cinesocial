"use client"
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/utils/api.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.js';

const Signup = () => {

  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {

      let res = await api.post("/api/auth/signup",data);
      console.log(res.data);
      const safeUser = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        avatar: res.data.user.avatar || "",
        title: res.data.user.title || "",
        bio: res.data.user.bio || "",
        fantag: res.data.user.fantag || "",
        genre: res.data.user.genre || [],
        dob: res.data.user.dob || ""
      };
      localStorage.setItem("accesstoken",res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(safeUser));
      login(safeUser);
      router.push("/");
      reset();

    } catch (error) {
      console.log(error || "something went wrong...");
    }
  }

   const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <>
    <div className='min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>

  {/* LEFT SECTION */}
  <div
    className="
    w-full lg:w-[50vw]
    min-h-[42vh] lg:min-h-screen
    flex flex-col justify-center
    px-4 sm:px-8 md:px-12 lg:px-20
    pt-8 pb-3 lg:py-0
    relative overflow-hidden
  "
  >

    {/* Background glow */}
    <div className="absolute top-[-80px] left-[-80px] w-[160px] sm:w-[300px] h-[160px] sm:h-[300px] bg-purple-600/20 blur-[100px] rounded-full"></div>

    <div className="absolute bottom-[-90px] right-[-90px] w-[170px] sm:w-[280px] h-[170px] sm:h-[280px] bg-red-500/20 blur-[100px] rounded-full"></div>

    {/* Logo */}
    <div className="flex items-center gap-2.5 sm:gap-4 mb-5 sm:mb-12 relative z-10">

      <div
        className="
        w-9 h-9 sm:w-12 sm:h-12
        rounded-xl flex items-center justify-center
        text-base sm:text-xl
        bg-gradient-to-br from-red-500 to-orange-400
        shadow-[0_0_20px_rgba(239,68,68,0.5)]
      "
      >
        🎬
      </div>

      <div
        className="
        text-[28px] sm:text-4xl
        font-bold tracking-wide
        bg-gradient-to-r from-white to-white/50
        text-transparent bg-clip-text
      "
      >
        CineSocial
      </div>
    </div>

    {/* Heading */}
    <h1
      className="
      text-[28px] sm:text-[42px] lg:text-[48px]
      leading-[1.05]
      font-bold
      max-w-lg
      mb-3 sm:mb-6
      relative z-10
    "
    >

      <span className="bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
        Every film has a story.
      </span>

      <br />

      <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
        So do you.
      </span>
    </h1>

    {/* Subtext */}
    <p
      className="
      text-[13px] sm:text-[18px] lg:text-[20px]
      text-white/55
      leading-relaxed
      max-w-md
      relative z-10
    "
    >
      Share your thoughts, explore perspectives, and connect with people who
      experience cinema the way you do.
    </p>
  </div>

  {/* RIGHT SECTION */}
  <div
    className="
    w-full lg:w-[50vw]
    min-h-[58vh] lg:min-h-screen
    px-3 sm:px-8 lg:px-20
    relative overflow-hidden
    flex items-start lg:items-center justify-center
    pt-1 pb-7 lg:py-0
  "
  >

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
      w-full max-w-sm sm:max-w-md
      mx-auto
      p-4 mt-5 lg:mt-0 sm:p-8
      rounded-2xl
      bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl
      space-y-4 sm:space-y-6
    "
    >

      {/* TITLE */}
      <div className="text-center">

        <h2 className="text-lg sm:text-2xl font-semibold tracking-wide text-white">
          Create Account
        </h2>

        <p className="text-[11px] sm:text-sm text-white/50 mt-1">
          Join the CineSocial community
        </p>
      </div>

      {/* NAME */}
      <div className="space-y-1.5">

        <input
          type="text"
          placeholder="Full Name"
          {...register("name", { required: true })}
          className="
          w-full
          px-3.5 sm:px-4
          py-2.5 sm:py-3
          rounded-lg
          bg-white/5
          border border-white/10
          text-[13px] sm:text-base
          text-white placeholder-white/40
          focus:outline-none focus:border-red-500
          focus:ring-2 focus:ring-red-500/20
          transition
        "
        />

        {errors.name && (
          <p className="text-[11px] text-red-400">
            Name is required
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="space-y-1.5">

        <input
          type="email"
          placeholder="Email address"
          {...register("email", { required: true })}
          className="
          w-full
          px-3.5 sm:px-4
          py-2.5 sm:py-3
          rounded-lg
          bg-white/5
          border border-white/10
          text-[13px] sm:text-base
          text-white placeholder-white/40
          focus:outline-none focus:border-red-500
          focus:ring-2 focus:ring-red-500/20
          transition
        "
        />

        {errors.email && (
          <p className="text-[11px] text-red-400">
            Email is required
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="
          w-full
          px-3.5 sm:px-4
          py-2.5 sm:py-3
          rounded-lg
          bg-white/5
          border border-white/10
          text-[13px] sm:text-base
          text-white placeholder-white/40
          focus:outline-none focus:border-red-500
          focus:ring-2 focus:ring-red-500/20
          transition
        "
        />

        {errors.password && (
          <p className="text-[11px] text-red-400">
            Password is required
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="
        w-full
        py-2.5 sm:py-3
        rounded-lg
        font-semibold
        text-[13px] sm:text-base
        bg-gradient-to-r from-red-500 to-orange-400
        hover:brightness-110
        transition
        text-white
        shadow-[0_0_18px_rgba(239,68,68,0.45)]
      "
      >
        Create Account
      </button>

      {/* LOGIN */}
      <p className="text-[11px] sm:text-sm text-white/50 text-center pt-1">
        Already have an account?{" "}

        <Link href="./Login">
          <span className="text-red-400 font-medium hover:text-orange-400 transition cursor-pointer">
            Sign in
          </span>
        </Link>
      </p>
    </form>
  </div>
</div>
    </>
  )
}

export default Signup