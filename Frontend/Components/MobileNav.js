"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaHome } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { GiArtificialIntelligence } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

const navItems = [
  {
    href: "/",
    icon: FaHome,
  },
  {
    href: "/Community",
    icon: MdGroups2,
  },
  {
    href: "/Post",
    icon: IoIosCreate,
  },
  {
    href: "/chatbot",
    icon: GiArtificialIntelligence,
  },
  {
    href: "/Profile",
    icon: CgProfile,
  },
];

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-[100] w-[95%] max-w-md -translate-x-1/2 lg:hidden overflow-hidden">
      
      {/* Glassmorphism Container */}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex h-[60px] w-[60px] flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {/* Active Glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-pink-500/20 to-purple-500/20 blur-md" />
              )}

              <Icon
                className={`relative z-10 transition-all duration-300 ${
                  isActive ? "scale-110" : "scale-100"
                }`}
                size={24}
              />

              <span
                className={`relative z-10 mt-1 text-[10px] font-medium tracking-wide ${
                  isActive ? "text-white" : "text-white/70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;