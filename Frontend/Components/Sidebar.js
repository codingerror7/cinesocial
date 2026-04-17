"use client"
import React from "react";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-68 bg-gradient-to-b from-[#0e0e14] to-black border-r border-white/10 flex flex-col z-100 py-2">
      
      {/* LOGO */}
      <div className="px-6 pb-9 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-red-500 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
          🎬
        </div>
        <div className="text-[22px] tracking-[2px] font-bold bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
          CineSocial
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3">

        {/* MAIN */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          Main
        </div>

        <NavItem icon="🏠" text="Home Feed" active />
        <NavItem icon="🔭" text="Explore" />
        <NavItem icon="✏️" text="Create Post" />

        {/* LIBRARY */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          Library
        </div>

        <NavItem icon="🎥" text="Movie Pages" />
        <NavItem icon="🔔" text="Notifications" badge="7" />
        <NavItem icon="👤" text="Profile" />

        {/* MORE */}
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-white/40 px-3 mt-5 mb-2">
          More
        </div>

        <NavItem icon="📋" text="Watchlist" />
        <NavItem icon="⚙️" text="Settings" />
      </nav>

      {/* USER */}
      <div className="mt-auto px-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition">
          
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-purple-500 to-red-500 border-2 border-purple-400/40">
            AK
          </div>

          <div className="overflow-hidden">
            <div className="text-[13px] font-semibold truncate">
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer relative mb-1 transition
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