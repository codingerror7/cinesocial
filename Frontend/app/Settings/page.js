"use client"
import React from 'react'
import { useState } from 'react';
import Link from 'next/link';
import {useAuth} from '@/context/AuthContext.js';
import {useRouter} from 'next/navigation';
import { FaWhatsapp } from "react-icons/fa";
import Navbar2 from '@/Components/Navbar2'
import MobileTopBar from '@/Components/MobileTopBar'
import Sidebar from '@/Components/Sidebar'

const page = () => {
    const faqs = [
  {
    q: "What is CineSocial?",
    a: "CineSocial is a social platform built for cinephiles to share reviews, theories, opinions, polls, and connect through cinema."
  },
  {
    q: "How is CineSocial different from other social media apps?",
    a: "Unlike traditional social apps, CineSocial is completely focused on movies, storytelling, fandoms, and cinematic discussions."
  },
  {
    q: "What can I post on CineSocial?",
    a: "You can share movie reviews, fan theories, alternate storylines, polls, images, recommendations, and spoiler discussions."
  },
  {
    q: "Does CineSocial support communities and discussions?",
    a: "Yes, users can join communities, interact with fellow cinephiles, and participate in topic-based movie conversations."
  },
  {
    q: "What makes CineSocial unique?",
    a: "CineSocial combines social networking with cinema culture through interactive features like polls, what-if scenarios, spoiler controls, and movie-focused communities."
  }
];

const {logout} = useAuth();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [isLoggedOut, setIsLoggedOut] = useState(false);


  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    logout();
    setIsLoggedOut(true);
    console.log("Logged out successfully.");
    setTimeout(()=>router.push("/Login"), 2000);
  }

  return (
    <>
    <div className='w-full min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white relative'>
        <Navbar2 />
        <MobileTopBar />
        <Sidebar />

         {/* Success */}
        {isLoggedOut && (
          <div
            className="lg:block hidden absolute w-100 top-30 left-130  text-center py-2.5 rounded-xl 
            bg-red-500/12 border border-red-500/20
            text-red-400 text-[12px] sm:text-sm 
            font-medium animate-pulse [animation-duration:3s]"
          >
            ✓ Logged out successfully!
          </div>
        )}

         <section className="relative w-full overflow-hidden bg-[#07070A] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 text-white">

      {/* Heading */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">

        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          Frequently Asked <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
            Questions
          </span>
        </h2>

        <p className="mt-5 text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about Cinesocial.
        </p>
      </div>

      {/* FAQ List */}
      <div className="relative z-10 mt-12 sm:mt-16 max-w-4xl mx-auto flex flex-col gap-4">

        {faqs.map((item, index) => (
          <div
            key={index}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl
            ${
              openIndex === index
                ? "border-white/30 bg-black/30 shadow-[0_0_30px_rgba(236,72,153,0.12)]"
                : "border-white/10 bg-black/30 hover:bg-white/[0.05]"
            }`}
          >

            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-left"
            >
              
              <span className="text-sm sm:text-base lg:text-lg font-medium text-white/90 leading-relaxed">
                {item.q}
              </span>

              <div
                className={`flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300
                ${
                  openIndex === index
                    ? "bg-white/20 text-white border-white/20 rotate-180"
                    : "border-white/10 text-white/60 group-hover:border-white/20"
                }`}
              >
                <span className="text-lg">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
            </button>

            {/* Answer */}
            <div
              className={`grid transition-all duration-500 ease-in-out
              ${
                openIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                
                <div className="px-5 sm:px-7 pb-5">
                  <div className="h-[1px] w-full bg-white/10 mb-4" />

                  <p className="text-sm sm:text-[15px] text-white/60 leading-relaxed">
                    {item.a}
                  </p>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
    <section className="relative w-full overflow-hidden bg-[#07070A] py-10 sm:py-24 px-4 sm:px-6 lg:px-12 text-white">

  {/* Content */}
  <div className="relative z-10 max-w-5xl mx-auto">

    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto">

      <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
        Give Feedback/Contact us <br className="hidden sm:block" />
      </h2>

      <p className="mt-5 text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
        Have suggestions, ideas, or questions? We’re always open to hearing
        your thoughts and improving your experience.
      </p>
    </div>

    {/* Contact Card */}
    <div className="mt-12 max-w-3xl mx-auto">

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">

            {/* WhatsApp */}
            <button
  onClick={() =>
    window.open("https://wa.me/919300446947", "_blank")
  }
  className="group relative overflow-hidden font-[gilroy]
  inline-flex min-h-[50px] w-full sm:w-auto
  items-center justify-center gap-2.5
  rounded-xl px-7 py-3
  text-sm font-bold text-white
  bg-gradient-to-r from-emerald-500 to-green-500
  border border-emerald-400/20
  shadow-[0_10px_30px_rgba(16,185,129,0.28)]
  transition-all duration-300 ease-out
  hover:scale-[1.03]
  hover:shadow-[0_14px_40px_rgba(16,185,129,0.45)]
  hover:brightness-110
  active:scale-[0.98]"
>
  

  <FaWhatsapp
    className="relative z-10 text-[17px] text-white
    transition-transform duration-300
    group-hover:scale-110 group-hover:rotate-6"
  />

  <span className="relative z-10">
    WhatsApp Us
  </span>
</button>

            {/* Email */}
            <button
              onClick={() =>
                window.open("mailto:saraswatsujal@gmail.com")
              }
              className="group font-[gilroy] w-full sm:w-auto inline-flex items-center justify-center
              rounded-2xl border border-white/10 bg-balck/30
              px-8 py-3.5 text-sm sm:text-base font-semibold text-white
              backdrop-blur-xl transition-all duration-300
              hover:bg-white/[0.08] hover:border-orange-400/30
              hover:scale-[1.03]
              shadow-[0_0_30px_rgba(255,255,255,0.04)]"
            >
              Email Us
            </button>

          </div>
    </div>
  </div>
</section>
<section className="relative w-full overflow-hidden bg-[#07070A] py-10 sm:py-24 px-4 sm:px-6 lg:px-12 text-white">


  {/* Main Card */}
  <div
    className="relative z-10 max-w-4xl mx-auto
    rounded-3xl border border-white/10
    bg-black/30 backdrop-blur-2xl
    shadow-[0_0_40px_rgba(0,0,0,0.45)]
    overflow-hidden"
  >

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] via-transparent to-orange-500/[0.03]" />

    <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14">

      {/* Top Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left Side */}
        <div className="max-w-2xl text-center lg:text-left">

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5
            rounded-full border border-red-500/20
            bg-red-500/10 text-red-400
            text-xs sm:text-sm font-medium tracking-wide"
          >
           Account Session
          </div>

          <h2
            className="mt-5 text-3xl sm:text-4xl font-bold
            leading-tight tracking-tight"
          >
            Ready to Leave{" "}
            <span
              className="bg-gradient-to-r from-red-400 via-orange-300 to-red-600
              bg-clip-text text-transparent"
            >
              CineSocial?
            </span>
          </h2>

          <p
            className="mt-4 text-sm sm:text-base
            text-white/55 leading-relaxed"
          >
            You can securely log out of your account anytime.
            Your profile, posts, and cinematic journey will always
            be waiting for your return.
          </p>

          {/* Small Stats / Info */}
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">

            <div
              className="px-4 py-2 rounded-xl bg-black/30 backdrop-blur-xl
              border border-white/10 text-xs sm:text-sm text-white/70"
            >
              Secure Logout
            </div>

            <div
              className="px-4 py-2 rounded-xl bg-black/30 backdrop-blur-xl
              border border-white/10 text-xs sm:text-sm text-white/70"
            >
             Your data stays safe
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">

          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className="group relative overflow-hidden
            w-full sm:w-auto
            inline-flex items-center justify-center gap-3
            rounded-2xl px-8 py-2
            bg-gradient-to-r from-red-500 to-red-800
            text-white text-sm sm:text-base font-bold tracking-wide
            shadow-[0_12px_40px_rgba(239,68,68,0.35)]
            transition-all duration-300 ease-out
            hover:scale-[1.04]
            hover:shadow-[0_16px_50px_rgba(239,68,68,0.5)]
            active:scale-[0.98] cursor-pointer"
          >

            <span>
              LOG OUT
            </span>
          </button>

          {/* Extra Note */}
          <p className="text-[11px] sm:text-xs text-white/30 text-center max-w-[220px]">
            Logging out will end your current active session on this device.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
    </>
  )
}

export default page;