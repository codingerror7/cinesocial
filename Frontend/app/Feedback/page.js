"use client";

import React, { useState } from "react";
import {
  FaArrowRight,
  FaPaperPlane,
  FaRegCommentDots,
} from "react-icons/fa";

const feedbackTopics = [
  "User Experience",
  "Feature Suggestion",
  "Performance",
  "Community",
  "Design",
  "Bug Report",
];

const recentNotes = [
  {
    title: "The interface feels focused and distraction-free.",
    category: "Design",
  },
  {
    title: "Communities make film discussions feel meaningful.",
    category: "Community",
  },
  {
    title: "Would love a watchlist collaboration feature.",
    category: "Suggestion",
  },
];

const FeedbackPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("User Experience");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-20 sm:py-28">

          <div className="max-w-3xl">
            
            <p className="text-sm tracking-[0.25em] uppercase text-white/40">
              Feedback
            </p>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
              Every thoughtful platform is shaped by the people who use it.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/60 max-w-2xl">
              CineSocial is being built for people who care deeply about cinema,
              storytelling, and conversation. If something feels meaningful,
              missing, confusing, or worth improving — this is where you tell us.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-14 sm:py-18">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr] gap-10 lg:gap-16">

          {/* LEFT */}
          <div>

            {/* INTRO BLOCK */}
            <div className="border border-white/10 rounded-3xl p-6 sm:p-8 bg-white/[0.02]">
              
              <div className="flex items-start gap-4">
                
                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                  <FaRegCommentDots className="text-white/70 text-lg" />
                </div>

                <div>
                  <h2 className="text-2xl font-medium tracking-tight">
                    Share your perspective
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed">
                    Whether it is a small usability issue, a feature request,
                    or an idea that could improve discussion around films —
                    your feedback directly influences how CineSocial evolves.
                  </p>
                </div>
              </div>

              {/* TOPICS */}
              <div className="mt-8">
                
                <p className="text-sm text-white/45 mb-4">
                  What would you like to talk about?
                </p>

                <div className="flex flex-wrap gap-3">
                  
                  {feedbackTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border
                      ${
                        selectedTopic === topic
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white/65 border-white/10 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="mt-8 border border-white/10 rounded-3xl p-6 sm:p-8 bg-white/[0.02]">
              
              <div className="flex items-center justify-between gap-4 mb-8">
                
                <div>
                  <h3 className="text-2xl font-medium">
                    Write to us
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Selected topic: {selectedTopic}
                  </p>
                </div>

                <div className="hidden sm:flex w-12 h-12 rounded-2xl border border-white/10 items-center justify-center bg-white/[0.03]">
                  <FaPaperPlane className="text-white/70" />
                </div>
              </div>

              <form className="space-y-6">
                
                {/* NAME */}
                <div>
                  <label className="block text-sm text-white/55 mb-2">
                    Your name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full h-13 rounded-2xl bg-transparent border border-white/10 px-4 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-white/30"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm text-white/55 mb-2">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-13 rounded-2xl bg-transparent border border-white/10 px-4 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-white/30"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-sm text-white/55 mb-2">
                    Your thoughts
                  </label>

                  <textarea
                    rows={7}
                    placeholder="Tell us what you think about the platform, community experience, design, features, or anything else."
                    className="w-full rounded-3xl bg-transparent border border-white/10 p-4 text-white placeholder:text-white/30 outline-none resize-none transition-all duration-300 focus:border-white/30"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Send Feedback

                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">

            {/* SIDE NOTE */}
            <div className="border border-white/10 rounded-3xl p-6 sm:p-7 bg-white/[0.02]">
              
              <p className="text-sm uppercase tracking-[0.2em] text-white/35">
                Why feedback matters
              </p>

              <p className="mt-5 text-base leading-relaxed text-white/65">
                Most social platforms optimize for speed and noise. CineSocial
                is being shaped around thoughtful discussion, cinematic culture,
                and meaningful interaction. Listening carefully is part of the
                product philosophy.
              </p>
            </div>

            {/* RECENT NOTES */}
            <div className="border border-white/10 rounded-3xl p-6 sm:p-7 bg-white/[0.02]">
              
              <div className="flex items-center justify-between">
                
                <h3 className="text-xl font-medium">
                  Recent community notes
                </h3>

                <span className="text-xs text-white/35">
                  Selected feedback
                </span>
              </div>

              <div className="mt-6 space-y-5">
                
                {recentNotes.map((note, index) => (
                  <div
                    key={index}
                    className="border-b border-white/8 pb-5 last:border-none last:pb-0"
                  >
                    <p className="text-white/80 leading-relaxed">
                      {note.title}
                    </p>

                    <span className="inline-block mt-3 text-xs text-white/40">
                      {note.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT */}
            <div className="border border-white/10 rounded-3xl p-6 sm:p-7 bg-white/[0.02]">
              
              <h3 className="text-xl font-medium">
                Prefer direct contact?
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/55">
                For collaborations, partnerships, detailed reports, or long-form
                feedback, you can also reach out directly.
              </p>

              <div className="mt-6 space-y-4">
                
                <div className="border border-white/10 rounded-2xl px-4 py-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Email
                  </p>

                  <p className="mt-1 text-sm sm:text-base text-white/80 break-all">
                    saraswatsujal@gmail.com
                  </p>
                </div>

                <div className="border border-white/10 rounded-2xl px-4 py-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Response Philosophy
                  </p>

                  <p className="mt-1 text-sm text-white/60 leading-relaxed">
                    We read feedback carefully and prioritize improvements that
                    strengthen quality conversations and community experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;