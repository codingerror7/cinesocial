"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext.js";

import { FaHome } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { GiArtificialIntelligence } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: FaHome,
  },
  {
    href: "/Communities",
    label: "Communities",
    icon: MdGroups2,
  },
  {
    href: "/Post",
    label: "Create",
    icon: IoAdd,
    special: true,
  },
  {
    href: "/Chatbot",
    label: "AI",
    icon: GiArtificialIntelligence,
  },
  {
    href: "/Profile",
    label: "Profile",
    icon: CgProfile,
  },
];

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const profileHref = (mounted && user?._id)
    ? `/Profile/${user._id}`
    : "/Profile/123";

  return (
    <div
      className="
      fixed bottom-0 left-0 right-0
      z-[999]
      lg:hidden
      "
    >
      {/* BACKGROUND */}
      <div
        className="
        absolute inset-0
        border-t border-white/[0.06]
        bg-[#0B0B0C]/95
        backdrop-blur-xl
        "
      />

      {/* NAV */}
      <nav
        className="
        relative
        flex items-center justify-between

        h-[72px]
        px-2
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const href =
            item.href === "/Profile"
              ? profileHref
              : item.href;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`
                relative
                flex flex-1 flex-col
                items-center justify-center

                h-full

                transition-all duration-200
              `}
            >
              {/* CREATE BUTTON */}
              {item.special ? (
                <div
                  className="
                  flex items-center justify-center

                  h-12 w-12
                  rounded-2xl

                  bg-white
                  text-black

                  transition-all duration-200
                  active:scale-95
                  "
                >
                  <Icon size={24} />
                </div>
              ) : (
                <>
                  {/* ICON */}
                  <Icon
                    size={20}
                    className={`
                      transition-all duration-200

                      ${
                        isActive
                          ? "text-white"
                          : "text-white/40"
                      }
                    `}
                  />

                  {/* LABEL */}
                  <span
                    className={`
                      mt-1
                      text-[10px]
                      font-medium

                      ${
                        isActive
                          ? "text-white"
                          : "text-white/35"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* ACTIVE LINE */}
                  {isActive && (
                    <div
                      className="
                      absolute top-0
                      h-[2px] w-8
                      rounded-full
                      bg-white
                      "
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;