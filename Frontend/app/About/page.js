"use client";

import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen w-full bg-[#070707] text-white overflow-x-hidden">

      {/* HERO */}
      <section className="w-full border-b border-white/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-32 pb-24">

          <div className="max-w-4xl">

            <p className="text-sm tracking-[0.18em] uppercase text-white/40">
              About CineSocial
            </p>

            <h1
              className="
              mt-6
              text-5xl sm:text-6xl lg:text-7xl
              font-semibold
              tracking-tight
              leading-[1]
              "
            >
              A social platform
              <br />
              built around cinema.
            </h1>

            <p
              className="
              mt-8
              max-w-2xl
              text-base sm:text-lg
              leading-relaxed
              text-white/60
              "
            >
              CineSocial is a space designed for people who experience films
              beyond entertainment. It brings together conversations, opinions,
              communities, and storytelling into one focused cinematic platform.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="w-full border-b border-white/10">

        <div
          className="
          max-w-7xl mx-auto
          px-5 sm:px-8 lg:px-16
          py-20 sm:py-28
          "
        >

          <div className="grid lg:grid-cols-12 gap-16">

            {/* LEFT */}
            <div className="lg:col-span-4">

              <p className="text-sm tracking-[0.18em] uppercase text-white/35">
                The Idea
              </p>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-8">

              <div className="space-y-8 text-white/70 leading-[1.9] text-base sm:text-lg">

                <p>
                  Most conversations about cinema today are fragmented. Reviews
                  exist on one platform, discussions on another, communities
                  somewhere else, and meaningful film conversations are often
                  lost inside generic social media feeds.
                </p>

                <p>
                  CineSocial was created to solve that problem. The vision was
                  simple — build a dedicated platform where cinema becomes the
                  center of interaction rather than just another category inside
                  a larger network.
                </p>

                <p>
                  Whether someone wants to share a film theory, discuss a
                  director’s style, post scene analysis, join communities, or
                  simply connect with people who appreciate storytelling, the
                  experience should feel focused, immersive, and intentional.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES IT DIFFERENT */}
      <section className="w-full border-b border-white/10">

        <div
          className="
          max-w-7xl mx-auto
          px-5 sm:px-8 lg:px-16
          py-20 sm:py-28
          "
        >

          <div className="grid lg:grid-cols-12 gap-16">

            {/* LEFT */}
            <div className="lg:col-span-4">

              <p className="text-sm tracking-[0.18em] uppercase text-white/35">
                What Makes It Different
              </p>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-8">

              <div className="grid sm:grid-cols-2 gap-6">

                {[
                  {
                    title: "Cinema-focused identity",
                    desc:
                      "Every feature is designed around movies, storytelling, directors, fandoms, and cinematic culture.",
                  },
                  {
                    title: "Community-driven interaction",
                    desc:
                      "Users can join dedicated spaces for genres, franchises, filmmakers, and discussions.",
                  },
                  {
                    title: "Thoughtful content sharing",
                    desc:
                      "From theories and reviews to polls and scene breakdowns, content is built for deeper engagement.",
                  },
                  {
                    title: "Modern cinematic experience",
                    desc:
                      "The interface is intentionally minimal, dark, and immersive to reflect the atmosphere of cinema itself.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.02]
                    p-7
                    transition-all duration-300
                    hover:border-white/20
                    "
                  >

                    <h3 className="text-xl font-medium text-white">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-white/55">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="w-full border-b border-white/10">

        <div
          className="
          max-w-7xl mx-auto
          px-5 sm:px-8 lg:px-16
          py-20 sm:py-28
          "
        >

          <div className="grid lg:grid-cols-12 gap-16">

            {/* LEFT */}
            <div className="lg:col-span-4">

              <p className="text-sm tracking-[0.18em] uppercase text-white/35">
                The Experience
              </p>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-8">

              <div className="space-y-8 text-base sm:text-lg leading-[1.9] text-white/70">

                <p>
                  CineSocial is being built with the belief that design should
                  never distract from conversation. The platform focuses on
                  clarity, readability, and immersion.
                </p>

                <p>
                  The dark visual language, spacious layouts, and minimal
                  interface are intended to create a calm environment where
                  users can focus on ideas, stories, and discussions instead of
                  noise.
                </p>

                <p>
                  Every decision — from communities to profiles to post formats
                  — is shaped around creating meaningful interaction between
                  people who genuinely care about cinema.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="w-full">

        <div
          className="
          max-w-7xl mx-auto
          px-5 sm:px-8 lg:px-16
          py-24 sm:py-32
          "
        >

          <div className="max-w-4xl">

            <p className="text-sm tracking-[0.18em] uppercase text-white/35">
              Looking Ahead
            </p>

            <h2
              className="
              mt-6
              text-4xl sm:text-5xl
              font-semibold
              leading-tight
              tracking-tight
              "
            >
              Building a long-term home
              <br />
              for cinephiles worldwide.
            </h2>

            <p
              className="
              mt-8
              text-base sm:text-lg
              leading-relaxed
              text-white/60
              max-w-3xl
              "
            >
              CineSocial is still evolving, but the goal remains constant:
              create a platform where people can experience cinema together in a
              more thoughtful, connected, and community-driven way.
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap items-center gap-4">

              <Link href="/">
                <button
                  className="
                  rounded-2xl
                  bg-white
                  px-7 py-3.5
                  text-sm font-medium
                  text-black
                  transition-all duration-300
                  hover:opacity-90
                  "
                >
                  Home
                </button>
              </Link>

              <Link href="/Communities">
                <button
                  className="
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.02]
                  px-7 py-3.5
                  text-sm font-medium
                  text-white/80
                  transition-all duration-300
                  hover:bg-white/[0.05]
                  hover:border-white/20
                  "
                >
                  Explore Communities
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;