

import React from "react";
import { FiSearch } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";

const Searchbar = () => {
  return (
    <div className="w-full hidden lg:flex justify-center">
      
      <form className="relative w-full max-w-xl group">

        {/* Main Search Container */}
        <div
          className="
          relative flex items-center
          rounded-2xl py-2
          border border-white/20
          backdrop-blur-2xl
          overflow-hidden
          "
        >

          {/* Search Icon */}
          <div className="pl-5 text-white/40 text-[18px]">
            <FiSearch />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search movies, users, communities..."
            className="
            w-full h-full
            bg-transparent
            px-4
            text-sm text-white
            placeholder:text-white/35
            outline-none
            font-[gilroy]
            tracking-wide
            "
          />

          {/* Right Badge */}
          <div
            className="
            mr-3 flex items-center gap-1
            rounded-xl border border-white/10
            bg-white/[0.03]
            px-3 py-1.5 cursor-pointer
            text-[11px] text-white/45
            "
          >
            <IoSparklesOutline className="text-[13px]" />
            Explore
          </div>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;