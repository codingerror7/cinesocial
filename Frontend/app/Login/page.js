"use client"
import React from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.js';

const Login = () => {
  let router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {

      let res = await axios.post("http://localhost:8000/api/auth/login",data);
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
      localStorage.setItem("user", JSON.stringify(safeUser));
      login(safeUser);
      router.push("/");
      reset();

    } catch (error) {
      console.log(error.response.data);
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
    <div className='min-h-screen w-full flex bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>
      <div className="w-[50vw] min-h-screen flex flex-col justify-center px-20 relative overflow-hidden">

  {/* Background glow */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-[-120px] right-[-100px] w-[280px] h-[280px] bg-red-500/20 blur-[120px] rounded-full"></div>

  {/* Logo */}
  <div className="flex items-center gap-4 mb-12">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl 
      bg-gradient-to-br from-red-500 to-orange-400 
      shadow-[0_0_30px_rgba(239,68,68,0.6)]">
      🎬
    </div>

    <div className="text-4xl font-bold tracking-wide 
      bg-gradient-to-r from-white to-white/50 
      text-transparent bg-clip-text">
      CineSocial
    </div>
  </div>

  {/* Heading */}
  <h1 className="text-[48px] leading-[1.1] font-bold max-w-xl mb-6">
    <span className="bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
      Every film has a story.
    </span>
    <br />
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
      So do you.
    </span>
  </h1>

  {/* Subtext */}
  <p className="text-[20px] text-white/60 leading-relaxed max-w-lg">
    Share your thoughts, explore perspectives, and connect with people who 
    experience cinema the way you do.
  </p>
  

</div>
<div className='w-[50vw] min-h-screen px-20 relative overflow-hidden'>
  <form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full max-w-md mx-auto mt-40 p-8 rounded-2xl 
             bg-white/[0.04] backdrop-blur-xl border border-white/10 
             shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6"
>

  {/* TITLE */}
  <div className="text-center">
    <h2 className="text-2xl font-semibold tracking-wide text-white">
      Login to Your Account
    </h2>
    <p className="text-sm text-white/50 mt-1">
      Join the CineSocial community
    </p>
  </div>

  {/* EMAIL */}
  <div className="space-y-2">
    <input
      type="email" name='email'
      placeholder="Email address"
      {...register("email", { required: true })}
      className="w-full px-4 py-3 rounded-lg 
                 bg-white/5 border border-white/10 
                 text-white placeholder-white/40
                 focus:outline-none focus:border-red-500 
                 focus:ring-2 focus:ring-red-500/20 transition"
    />
    {errors.email && (
      <p className="text-xs text-red-400">Email is required</p>
    )}
  </div>

  {/* PASSWORD */}
  <div className="space-y-2">
    <input
      type="password" name='password'
      placeholder="password"
      {...register("password", { required: true })}
      className="w-full px-4 py-3 rounded-lg 
                 bg-white/5 border border-white/10 
                 text-white placeholder-white/40
                 focus:outline-none focus:border-red-500 
                 focus:ring-2 focus:ring-red-500/20 transition"
    />
    {errors.password && (
      <p className="text-xs text-red-400">Password is required</p>
    )}
  </div>

  {/* BUTTON */}
  <button
    type="submit"
    className="w-full py-3 rounded-lg font-semibold 
               bg-gradient-to-r from-red-500 to-orange-400 
               hover:brightness-110 transition 
               text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]"
  >
    Login
  </button>
<p className="text-sm text-white/50 text-center mt-4">
  Dont have an account?{" "}
  <Link href="./Signup">
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