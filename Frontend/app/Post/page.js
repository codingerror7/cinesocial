"use client";

import React from "react";
import Sidebar from "@/Components/Sidebar";
import CreatePost from "@/Components/Createpost.js";
import MobileTopBar from "@/Components/MobileTopBar";

const Page = () => {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-[#0e0e14] to-black text-white">
      <MobileTopBar />

      {/* Sidebar (fixed left) */}
      <div className="w-[16rem] flex-shrink-0 border-r border-white/10">
        <Sidebar />
      </div>
      <div className="flex-1">
        <CreatePost />
      </div>
    </div>
  );
};

export default Page;