"use client"
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


const Sidebar = () => {
  
  const router = useRouter();
  const [popup, setpopup] = useState(false);
  const userId = 123; // Replace with actual user ID from auth context or state
  
  function handleLogOut(){
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    console.log("Logged out successfully.");
    router.push("/");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-68 bg-gradient-to-b from-[#0e0e14] to-black border-r border-white/10 flex flex-col z-100 py-2">
      
      {/* LOGO */}
      <div className="px-6 pb-6 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-red-500 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          🎬
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

        <Link href="/"><NavItem text="Home" /></Link>
        <Link href="./Post"><NavItem text="Communities" /></Link>
        <Link href="./Post"><NavItem text="Create Post" /></Link>

        {/* LIBRARY */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          Library
        </div>

        <NavItem text="Chatbot" />
        <NavItem text="Notifications" badge="7" />
        <Link href={`/Profile/${userId}`}><NavItem text="Profile" /></Link>

        {/* MORE */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          More
        </div>

        <NavItem text="Watchlist" />
        <NavItem text="Settings" />
      </nav>

      {/* USER */}
      <div onMouseEnter={()=>setpopup(true)} 
           onMouseLeave={()=>setpopup(false)}   
           className="mt-auto px-5 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition">
              {/* USER POPUP */}
         {popup && <div className="absolute mb-30 py-2 w-50 border border-white/10 rounded-xl px-2 py-3 bg-black">
            <ul>
              <Link href="./Signup" className="w-full cursor-pointer text-md text-left px-2 py-1 text-white/60 hover:bg-white/5 hover:text-white">Login</Link>
              <button onClick={handleLogOut}
                className="w-full cursor-pointer text-md text-left px-2 py-1 text-white/60 hover:bg-white/5 hover:text-white">Logout
              </button>
            </ul>
          </div>}
          
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-purple-500 to-red-500 border-2 border-purple-400/40">
            AK
          </div>

          <div className="overflow-hidden">
            <div className="text-[15px] text-white font-semibold truncate">
              Arjun Kapoor
            </div>
            <div className="text-[11px] text-white/40 truncate">
              @cinematic_arjun
            </div>
          </div>

        </div>
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