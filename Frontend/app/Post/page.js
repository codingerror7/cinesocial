"use client";

import React from "react";
import Sidebar from "@/Components/Sidebar";
import CreatePost from "@/Components/Createpost.js";
import MobileTopBar from "@/Components/MobileTopBar";
import Navbar2 from "@/Components/Navbar2";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0e0e14] to-black text-white overflow-x-hidden">
  
  <Navbar2 /> 
  <MobileTopBar />

  {/* Desktop Sidebar */}
  <div className="hidden lg:block fixed left-0 top-0 h-screen w-[16rem] border-r border-white/10 z-40">
    <Sidebar />
  </div>

  {/* Main Content */}
  <div className="w-full lg:ml-[16rem]">
    <CreatePost />
  </div>

</div>
  );
};

export default Page;