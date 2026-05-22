"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext.js";

import { FaHome } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { GiArtificialIntelligence } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: FaHome,
  },
  {
    href: "/Community",
    label: "Groups",
    icon: MdGroups2,
  },
  {
    href: "/Post",
    label: "Create",
    icon: IoIosCreate,
    special: true,
  },
  {
    href: "/chatbot",
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

  const profileHref = user?._id
    ? `/Profile/${user._id}`
    : "/";

  return (
    <nav
      className="
        fixed bottom-4 left-1/2 z-[100]
        w-[94%] max-w-md
        -translate-x-1/2
        lg:hidden
      "
    >

      {/* OUTER GLOW */}
      <div className="
        absolute inset-0
        rounded-[30px]
        bg-gradient-to-r
        from-orange-500/10
        via-purple-500/10
        to-pink-500/10
        blur-2xl
      " />

      {/* NAV CONTAINER */}
      <div
        className="
          relative
          flex items-center justify-between
          px-2 py-2
          rounded-[28px]
          border border-white/[0.08]
          bg-[#121215]/80
          backdrop-blur-2xl
          shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        "
      >

        {navItems.map((item) => {

          const Icon = item.icon;

          const href =
            item.href === "/Profile"
              ? profileHref
              : item.href;

          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`
                relative flex flex-col
                items-center justify-center
                transition-all duration-300
                rounded-2xl

                ${
                  item.special
                    ? `
                      -mt-8
                      w-[68px] h-[68px]
                    `
                    : `
                      w-[58px] h-[58px]
                    `
                }

                ${
                  isActive && !item.special
                    ? `
                      bg-white/[0.06]
                    `
                    : ""
                }
              `}
            >

              {/* ACTIVE GLOW */}
              {isActive && !item.special && (
                <div
                  className="
                    absolute inset-0
                    rounded-2xl
                    bg-gradient-to-b
                    from-orange-500/15
                    to-purple-500/15
                    border border-white/10
                  "
                />
              )}

              {/* SPECIAL CREATE BUTTON */}
              {item.special ? (
                <div
                  className="
                    relative flex items-center justify-center
                    w-[64px] h-[64px]
                    rounded-2xl
                    bg-gradient-to-br
                    from-orange-400
                    via-pink-500
                    to-purple-600
                    shadow-[0_8px_30px_rgba(236,72,153,0.45)]
                    border border-white/20
                    transition-all duration-300
                    hover:scale-105
                    active:scale-95
                  "
                >

                  <div className="
                    absolute inset-0
                    rounded-2xl
                    bg-white/10
                    backdrop-blur-xl
                  " />

                  <Icon
                    size={30}
                    className="
                      relative z-10
                      text-white
                    "
                  />

                </div>
              ) : (
                <>
                  {/* ICON */}
                  <Icon
                    size={22}
                    className={`
                      relative z-10 transition-all duration-300
                      ${
                        isActive
                          ? `
                            text-white
                            scale-110
                          `
                          : `
                            text-white/55
                            group-hover:text-white/90
                          `
                      }
                    `}
                  />

                  {/* LABEL */}
                  <span
                    className={`
                      relative z-10
                      mt-1
                      text-[10px]
                      font-medium
                      tracking-wide
                      transition-all duration-300

                      ${
                        isActive
                          ? `
                            text-white
                          `
                          : `
                            text-white/45
                          `
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </>
              )}

            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;