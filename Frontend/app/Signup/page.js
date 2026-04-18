import React from 'react'

const Signup = () => {
  return (
    <>
    <div className='min-h-screen w-full flex bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>
      <div className="w-[50vw] min-h-screen flex flex-col justify-center px-20 relative overflow-hidden">

  {/* Background glow */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-[-120px] right-[-100px] w-[280px] h-[280px] bg-red-500/20 blur-[120px] rounded-full"></div>

  {/* Logo */}
  <div className="flex items-center gap-4 mb-12">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl 
      bg-gradient-to-br from-red-500 to-orange-400 
      shadow-[0_0_30px_rgba(239,68,68,0.6)]">
      🎬
    </div>

    <div className="text-4xl font-bold tracking-wide 
      bg-gradient-to-r from-white to-white/50 
      text-transparent bg-clip-text">
      CineSocial
    </div>
  </div>

  {/* Heading */}
  <h1 className="text-[48px] leading-[1.1] font-bold max-w-xl mb-6">
    <span className="bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
      Every film has a story.
    </span>
    <br />
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
      So do you.
    </span>
  </h1>

  {/* Subtext */}
  <p className="text-[20px] text-white/60 leading-relaxed max-w-lg">
    Share your thoughts, explore perspectives, and connect with people who 
    experience cinema the way you do.
  </p>
  

</div>
    </div>
    </>
  )
}

export default Signup