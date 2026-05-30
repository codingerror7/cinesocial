
import React from 'react'

function SuggestedUser({ name, info, variant = "v1", following = false }) {
  
  const avatarStyles = {
    v1: "from-orange-400 to-pink-500",
    v2: "from-sky-500 to-indigo-500",
    v3: "from-green-500 to-sky-500",
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3 border-t border-white/10 hover:bg-white/5 transition cursor-pointer ">
      
      {/* AVATAR */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br ${avatarStyles[variant]}`}>
        {name.slice(0, 2).toUpperCase()}
      </div>

      {/* INFO */}
      <div className="flex-1">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-white/40">{info}</div>
      </div>

      {/* BUTTON */}
      <button
        className={`text-xs px-3 py-1.5 rounded-full border transition
          ${following
            ? "border-white/20 text-white/50"
            : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          }`}
      >
        {following ? "Following" : "Follow"}
      </button>

    </div>
  );
}

const Suggest = () => {
  return (
    <>
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-sm tracking-wider font-semibold">👥 Suggested</div>
        <span className="text-xs text-red-400 hover:text-orange-400 cursor-pointer">
          See all
        </span>
      </div>

      {/* USERS */}
      <div>
        <SuggestedUser name="Nisha K." info="Film critic · 4.2k followers" />
        <SuggestedUser name="Dev Rao" info="Arthouse · 2.8k followers" variant="v2" />
        <SuggestedUser name="Sneha Mishra" info="Indie cinema · 1.9k followers" variant="v3" following />
      </div>

    </div>
    </>
  )
}

export default Suggest