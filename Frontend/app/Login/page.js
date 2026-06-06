"use client"
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/utils/api.js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.js';
import { MdMovieFilter } from "react-icons/md";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";


const Login = () => {
  let router = useRouter();
  const { login } = useAuth();
  const [isLogin, setisLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {

      let res = await api.post("/api/auth/login",data);
      console.log(data);
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
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(safeUser));
      setisLogin(true);
      login(safeUser);
      setTimeout(() => router.push("/"), 2000);
      reset();

    } catch (error) {
      const server = error?.response?.data || error?.message || error;
      console.error('Login failed:', server);
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
       {/* Success */}
        {isLogin && (
          <div
            className="lg:block hidden absolute w-100 top-20 left-130 text-center py-2.5 rounded-xl 
            bg-green-500/12 border border-green-500/20
            text-green-400 text-[12px] sm:text-sm 
            font-medium"
          >
            ✓ Login successful! Redirecting...
          </div>
        )}

  {/* LEFT SECTION */}
  <div className="
    w-full lg:w-[50vw]
    min-h-[42vh] lg:min-h-screen
    flex flex-col justify-center
    px-4 sm:px-8 md:px-12 lg:px-20
    pt-8 pb-3 lg:py-0
    relative overflow-hidden
  ">

    {/* Background glow */}
    <div className="absolute top-[-80px] left-[-80px] w-[160px] sm:w-[260px] h-[160px] sm:h-[260px] bg-purple-600/20 blur-[100px] rounded-full"></div>

    <div className="absolute bottom-[-100px] right-[-80px] w-[160px] sm:w-[240px] h-[160px] sm:h-[240px] bg-red-500/20 blur-[100px] rounded-full"></div>

    {/* Logo */}
    <div className="flex items-center gap-2.5 sm:gap-4 mb-6 sm:mb-10 relative z-10">

      <div
        className="
        w-9 h-9 sm:w-12 sm:h-12
        rounded-xl flex items-center justify-center
        text-base sm:text-xl
        bg-gradient-to-br from-red-500 to-orange-400
        shadow-[0_0_20px_rgba(239,68,68,0.5)]
      "
      >
        <MdMovieFilter className="text-white" size={30} />
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
      leading-[1.08]
      font-bold
      max-w-xl
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
      text-white/60
      leading-relaxed
      max-w-md sm:max-w-lg
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
    pt-2 pb-8 lg:py-0
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
          Login to Your Account
        </h2>

        <p className="text-[11px] sm:text-sm text-white/50 mt-1">
          Join the CineSocial community
        </p>
      </div>

      {/* EMAIL */}
      <div className="space-y-1.5">

        <input
          type="email"
          name="email"
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
          text-white
          placeholder-white/40
          focus:outline-none
          focus:border-red-500
          focus:ring-2
          focus:ring-red-500/20
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="
            w-full
            pl-3.5 pr-10 sm:pl-4 sm:pr-12
            py-2.5 sm:py-3
            rounded-lg
            bg-white/5
            border border-white/10
            text-[13px] sm:text-base
            text-white
            placeholder-white/40
            focus:outline-none
            focus:border-red-500
            focus:ring-2
            focus:ring-red-500/20
            transition
          "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            {showPassword ? <IoIosEyeOff size={20} /> : <IoMdEye size={20} />}
          </button>
        </div>

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
        shadow-[0_0_18px_rgba(239,68,68,0.4)]
      "
      >
        Login
      </button>

      {/* SIGNUP */}
      <p className="text-[11px] sm:text-sm text-white/50 text-center pt-1">
        Dont have an account?{" "}

        <Link href="/Signup">
          <span className="text-red-400 font-medium hover:text-orange-400 transition cursor-pointer">
            Create account
          </span>
        </Link>
      </p>
    </form>
  </div>
</div>
    </>
  )
}

export default Login;