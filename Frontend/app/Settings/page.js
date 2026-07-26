"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext.js";
import { usePopup } from "@/context/PopupContext.js";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import Navbar2 from "@/Components/Navbar2";
import MobileTopBar from "@/Components/MobileTopBar";
import Sidebar from "@/Components/Sidebar";

const page = () => {
  const faqs = [
    {
      q: "What is CineSocial?",
      a: "CineSocial is a social platform built for cinephiles to share Stories, reviews, theories, opinions, polls, and connect through cinema with other cinephiles. It is the platform which allows you to connect with cinema lovers, share your thoughts and experiences on a movie/series and to remain in your own cinematic world.",
    },
    {
      q: "How is CineSocial different from other social media apps?",
      a: "Unlike traditional social apps, CineSocial is completely focused on movies, storytelling, fandoms, and cinematic discussions. it is a place where cinephiles can share their love for cinema, engage in meaningful conversations, and connect with like-minded individuals who share their passion for films.",
    },
    {
      q: "What can I post on CineSocial?",
      a: "You can share movie reviews, fan theories, alternate storylines, polls, images, recommendations, and spoiler discussions.",
    },
    {
      q: "Does CineSocial support communities and discussions?",
      a: "Yes, users can join communities, interact with fellow cinephiles, and participate in topic-based movie conversations.",
    },
    {
      q: "What makes CineSocial unique?",
      a: "CineSocial combines social networking with cinema culture through interactive features like polls, what-if scenarios, spoiler controls, and movie-focused communities.",
    },
  ];

  const { logout } = useAuth();
  const router = useRouter();
  const { showModal, showToast } = usePopup();

  const [openIndex, setOpenIndex] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleLogOut = () => {
    showModal("confirm", {
      title: "Confirm Logout",
      message: "Are you sure you want to log out? You will need to sign in again to access your account.",
      confirmText: "Logout",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        logout();
        setIsLoggedOut(true);
        showToast("success", "Logged out successfully!");
        setTimeout(() => router.push("/Login"), 1000);
      }
    });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#070707] text-white">
        <Navbar2 />
        <MobileTopBar />
        <Sidebar />

        {/* MAIN */}
        <div className="w-full lg:pl-[16rem] pt-20 sm:pt-24 pb-16">

          {/* SUCCESS MESSAGE */}
          {isLoggedOut && (
            <div className="px-4 sm:px-6 mb-6">
              <div
                className="max-w-md rounded-2xl border border-red-500/20
                bg-red-500/[0.08] px-4 py-3 text-sm text-red-300"
              >
                Logged out successfully.
              </div>
            </div>
          )}

          {/* HERO */}
          <section className="px-4 sm:px-6 lg:px-10">

            <div
              className="max-w-6xl mx-auto border border-white/10
              rounded-[28px] bg-[#070707]"
            >

              <div className="px-6 sm:px-10 lg:px-14 py-12 sm:py-16">

                <div className="max-w-3xl">
                  <div
                    className="inline-flex items-center rounded-full
                    border border-white/10 bg-white/[0.03]
                    px-4 py-1.5 text-xs tracking-wide text-white/55"
                  >
                    CineSocial Support & Account
                  </div>

                  <h1
                    className="mt-6 text-4xl sm:text-5xl lg:text-6xl
                    font-semibold tracking-tight leading-[1.05]"
                  >
                    Built for people
                    <br />
                    who experience cinema deeply.
                  </h1>

                  <p
                    className="mt-6 max-w-2xl text-sm sm:text-base
                    leading-relaxed text-white/55"
                  >
                    CineSocial is designed as a space where conversations around
                    films feel meaningful, thoughtful, and community-driven.
                    Whether you are here to discuss storytelling, discover
                    communities, or share perspectives, this space is built
                    around cinema culture.
                  </p>
                </div>

                {/* QUICK LINKS */}
                <div
                  className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >

                  <div
                    className="rounded-2xl border border-white/10
                    bg-white/[0.02] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Discussions
                    </p>

                    <h3 className="mt-3 text-lg font-medium">
                      Thoughtful Conversations
                    </h3>

                    <p className="mt-2 text-sm text-white/50 leading-relaxed">
                      Reviews, interpretations, theories, and cinematic analysis.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-white/10
                    bg-white/[0.02] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Communities
                    </p>

                    <h3 className="mt-3 text-lg font-medium">
                      Curated Spaces
                    </h3>

                    <p className="mt-2 text-sm text-white/50 leading-relaxed">
                      Join communities around genres, directors, franchises, and storytelling styles.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-white/10
                    bg-white/[0.02] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Expression
                    </p>

                    <h3 className="mt-3 text-lg font-medium">
                      Share Your Perspective
                    </h3>

                    <p className="mt-2 text-sm text-white/50 leading-relaxed">
                      Create posts, polls, reactions, and cinematic scenarios.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">

            <div
              className="max-w-6xl mx-auto border border-white/10
              rounded-[28px] bg-[#070707]"
            >

              <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14">

                <div className="max-w-2xl">
                  <p className="text-sm tracking-wide text-white/40">
                    Frequently Asked Questions
                  </p>

                  <h2
                    className="mt-3 text-3xl sm:text-4xl
                    font-semibold tracking-tight"
                  >
                    Common questions about CineSocial
                  </h2>
                </div>

                {/* FAQ LIST */}
                <div className="mt-10 flex flex-col gap-4">

                  {faqs.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-all duration-300
                      ${
                        openIndex === index
                          ? "border-white/20 bg-white/[0.03]"
                          : "border-white/10 bg-transparent hover:bg-white/[0.02]"
                      }`}
                    >

                      <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between
                        gap-5 px-5 sm:px-6 py-5 text-left"
                      >
                        <span
                          className="text-sm sm:text-base
                          leading-relaxed text-white/85"
                        >
                          {item.q}
                        </span>

                        <div
                          className={`w-8 h-8 rounded-full
                          flex items-center justify-center
                          border transition-all duration-300
                          ${
                            openIndex === index
                              ? "border-white/20 bg-white/10"
                              : "border-white/10 text-white/50"
                          }`}
                        >
                          {openIndex === index ? "−" : "+"}
                        </div>
                      </button>

                      <div
                        className={`grid transition-all duration-300
                        ${
                          openIndex === index
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-5">
                            <div className="h-px bg-white/10 mb-4" />

                            <p
                              className="text-sm sm:text-[15px]
                              leading-relaxed text-white/55"
                            >
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">

            <div
              className="max-w-6xl mx-auto border border-white/10
              rounded-[28px] bg-[#070707]"
            >

              <div
                className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14
                flex flex-col lg:flex-row items-start justify-between gap-10"
              >

                {/* LEFT */}
                <div className="max-w-2xl">

                  <p className="text-sm tracking-wide text-white/40">
                    Contact & Feedback
                  </p>

                  <h2
                    className="mt-3 text-3xl sm:text-4xl
                    font-semibold tracking-tight"
                  >
                    Help shape the future of CineSocial
                  </h2>

                  <p
                    className="mt-5 text-sm sm:text-base
                    text-white/55 leading-relaxed"
                  >
                    Feedback helps improve the platform experience. Whether you
                    want to report an issue, suggest a feature, or share ideas,
                    every message is valuable.
                  </p>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">

                  {/* WHATSAPP */}
                  <button
                    onClick={() =>
                      window.open(
                        "https://wa.me/919300446947",
                        "_blank"
                      )
                    }
                    className="group inline-flex items-center justify-center gap-3
                    rounded-2xl border border-emerald-500/20
                    bg-emerald-500 px-6 py-3.5
                    text-sm font-medium text-white
                    transition-all duration-300
                    hover:bg-emerald-400"
                  >
                    <FaWhatsapp className="text-lg transition-transform duration-300 group-hover:scale-110" />

                    WhatsApp
                  </button>

                  {/* EMAIL */}
                  <button
                    onClick={() =>
                      window.open("mailto:saraswatsujal@gmail.com")
                    }
                    className="group inline-flex items-center justify-center gap-3
                    rounded-2xl border border-white/10
                    bg-white/[0.03] px-6 py-3.5
                    text-sm font-medium text-white
                    transition-all duration-300
                    hover:bg-white/[0.06]"
                  >
                    <MdOutlineMail className="text-lg transition-transform duration-300 group-hover:scale-110" />

                    Email
                  </button>

                </div>
              </div>
            </div>
          </section>

          {/* ACCOUNT SESSION */}
          <section className="px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">

            <div
              className="max-w-6xl mx-auto border border-white/10
              rounded-[28px] bg-[#070707]"
            >

              <div
                className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14
                flex flex-col lg:flex-row items-start justify-between gap-10"
              >

                {/* LEFT */}
                <div className="max-w-2xl">

                  <p className="text-sm tracking-wide text-white/40">
                    Account Session
                  </p>

                  <h2
                    className="mt-3 text-3xl sm:text-4xl
                    font-semibold tracking-tight"
                  >
                    Manage your active session
                  </h2>

                  <p
                    className="mt-5 text-sm sm:text-base
                    text-white/55 leading-relaxed"
                  >
                    Logging out will securely end your current session on this
                    device. Your profile, communities, and posts remain safely
                    available whenever you return.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">

                    <div
                      className="rounded-xl border border-white/10
                      bg-white/[0.03] px-4 py-2
                      text-xs text-white/55"
                    >
                      Secure session handling
                    </div>

                    <div
                      className="rounded-xl border border-white/10
                      bg-white/[0.03] px-4 py-2
                      text-xs text-white/55"
                    >
                      Persistent profile data
                    </div>

                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-auto">

                  <button
                    onClick={handleLogOut}
                    className="w-full sm:w-auto inline-flex items-center justify-center
                    rounded-2xl border border-red-500/20
                    bg-red-500 px-8 py-3.5
                    text-sm font-semibold tracking-wide text-white
                    transition-all duration-300
                    hover:bg-red-400"
                  >
                    Log Out
                  </button>

                  <p className="mt-3 text-xs text-white/35">
                    Current session will be ended on this device.
                  </p>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default page;