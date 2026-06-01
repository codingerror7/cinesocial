
"use client";
import Navbar2 from '@/Components/Navbar2';
import Sidebar from '@/Components/Sidebar';
import MobileTopBar from '@/Components/MobileTopBar';
import MobileNav from '@/Components/MobileNav.js';
import Chatbot from '@/Components/Chatbot';

const page = () => {
  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>
      <Navbar2 />
      <MobileTopBar />
      <Sidebar />
      <MobileNav />

      <main className="lg:ml-[260px] pt-24 lg:pt-10 px-4 md:px-8 pb-20">
        <Chatbot />
      </main>
    </div>
  );
};

export default page;