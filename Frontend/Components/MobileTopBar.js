"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { MdMovieFilter } from "react-icons/md";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiInfo, FiMessageSquare } from "react-icons/fi";

const MobileTopBar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <>
      <header
        className="
        fixed top-0 left-0 right-0
        z-[100]
        lg:hidden

        border-b border-white/10
        bg-[#0B0B0C]/95
        backdrop-blur-xl
        "
      >
        <div
          className="
          flex items-center justify-between
          px-4 py-3
          "
        >
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div
              className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl

              bg-gradient-to-br
              from-red-500
              to-orange-400
              "
            >
              <MdMovieFilter
                className="text-white"
                size={22}
              />
            </div>

            <div>
              <h1
                className="
                text-lg
                font-bold
                tracking-wide
                text-white
                "
              >
                CineSocial
              </h1>
            </div>
          </Link>

          {/* MENU */}
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              onClick={() => setOpen(!open)}
              className="
              flex h-10 w-10
              items-center justify-center

              rounded-xl
              border border-white/10

              bg-white/[0.03]
              text-white

              transition-all duration-200
              active:scale-95
              "
            >
              <HiOutlineMenuAlt3 size={22} />
            </button>

            {/* DROPDOWN */}
            {open && (
              <div
                className="
                absolute right-0 top-12

                w-48
                overflow-hidden

                rounded-2xl
                border border-white/10

                bg-[#111111]
                shadow-2xl
                "
              >
                <Link
                  href="/About"
                  onClick={() => setOpen(false)}
                  className="
                  flex items-center gap-3

                  px-4 py-3

                  text-sm text-white/80

                  transition-colors
                  hover:bg-white/[0.05]
                  "
                >
                  <FiInfo size={18} />
                  About
                </Link>

                <div className="h-px bg-white/10" />

                <Link
                  href="/Feedback"
                  onClick={() => setOpen(false)}
                  className="
                  flex items-center gap-3

                  px-4 py-3

                  text-sm text-white/80

                  transition-colors
                  hover:bg-white/[0.05]
                  "
                >
                  <FiMessageSquare size={18} />
                  Feedback
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[64px] lg:hidden" />
    </>
  );
};

export default MobileTopBar;