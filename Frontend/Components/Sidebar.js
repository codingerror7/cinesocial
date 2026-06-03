"use client"
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.js";
import { FaHome } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { GiArtificialIntelligence } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLocalMovies } from "react-icons/md";
import { BsChatRightTextFill } from "react-icons/bs";
import { MdMovieFilter } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { MdExplore } from "react-icons/md";





const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [popup, setpopup] = useState(false);
  const { user } = useAuth();
  const userId = user?._id || 123;
  const displayName = user?.name || "Cinephile";
  const { logout } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    logout();
    setIsLoggedOut(true);
    console.log("Logged out successfully.");
    setTimeout(()=>router.push("/Login"), 2000);
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-68 bg-gradient-to-b from-[#0e0e14] to-black border-r border-white/10 flex flex-col z-100 py-2 hidden lg:flex">
      
      {/* LOGO */}
      <div className="px-6 pb-6 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-red-500 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          <MdMovieFilter className="text-white" size={30} />
        </div>
        <div className="text-[22px] tracking-[2px] font-bold bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
          CineSocial
        </div>
      </div>

      {/* NAVIGATION */}
      <nav>

        {/* MAIN */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          Main
        </div>  

        <Link href="/">
          <NavItem text="Home" icon={<FaHome />} active={pathname === "/"} />
        </Link>
        <Link href="/Communities">
          <NavItem text="Communities" icon={<MdGroups2 />} active={pathname === "/Communities"} />
        </Link>
        <Link href="/Post">
          <NavItem text="Create Post" icon={<IoIosCreate />} active={pathname === "/Post"} />
        </Link>

        {/* LIBRARY */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          Library
        </div>

        <Link href="/Chatbot">
          <NavItem text="Recommendations" icon={<GiArtificialIntelligence />} active={pathname === "/Chatbot"} />
        </Link>
        <Link href="/CreateCommunity">
          <NavItem text="Create Community" icon={<BsChatRightTextFill />} active={pathname === "/CreateCommunity"} />
        </Link>
        <Link href={`/Profile/${userId}`}>
          <NavItem text="Profile" icon={<CgProfile />} active={pathname === `/Profile/${userId}`} />
        </Link>

        {/* MORE */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          More
        </div>

        <Link href="/Watchlist">
          <NavItem text="Explore" icon={<MdExplore />} active={pathname === "/Watchlist"} />
        </Link>
        <Link href="/Settings">
          <NavItem text="Settings" icon={<IoSettingsOutline />} active={pathname === "/Settings"} />
        </Link>
      </nav>

      {/* Success */}
        {isLoggedOut && (
          <div
            className="lg:block hidden absolute w-100 top-20 left-130  text-center py-2.5 rounded-xl 
            bg-red-500/12 border border-red-500/20
            text-red-400 text-[12px] sm:text-sm 
            font-medium animate-pulse [animation-duration:3s]"
          >
            ✓ Logged out successfully!
          </div>
        )}

      {/* USER */}
      <div className="mt-auto border-t border-white/10">
  <button
    onClick={handleLogOut}
    className="
      flex
      w-full
      items-center
      gap-3
      rounded-xl
      px-3
      py-3
      text-sm
      font-medium
      text-zinc-400
      transition-all
      duration-200
      hover:bg-red-500/10
      hover:text-red-400
      cursor-pointer
    "
  >
    <IoLogOut size={20} />

    <span>Logout</span>
  </button>
</div>


    </aside>
  );
}


/* NAV ITEM COMPONENT */
function NavItem({ icon, text, active = false, badge }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-md font-bold cursor-pointer relative mb-1 transition
        ${active 
          ? "bg-gradient-to-r from-red-500/15 to-transparent text-white border border-red-500/20" 
          : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
    >
      
      {/* LEFT ACTIVE BAR */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-red-500 to-orange-400 rounded-r-md" />
      )}

      <span className="text-lg w-5 text-center">{icon}</span>
      <span>{text}</span>

      {badge && (
        <span className="ml-auto text-[10px] font-bold px-2 py-[2px] rounded-full bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.7)]">
          {badge}
        </span>
      )}
    </div>
  );
}

export default Sidebar;