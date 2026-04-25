"use client"
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.js"; // Update the path as needed
import axios from "axios";
import { useRouter } from "next/navigation";

// const MOVIE_SUGGESTIONS = [
//   "Inception (2010)", "Parasite (2019)", "The Godfather (1972)",
//   "2001: A Space Odyssey (1968)", "Mulholland Drive (2001)",
//   "Blade Runner 2049 (2017)", "Interstellar (2014)",
//   "The Dark Knight (2008)", "Spirited Away (2001)", "Roma (2018)",
// ];

const PLACEHOLDERS = {
  story: "Share your thoughts on a movie, theory, or idea…",
  poll: "Ask a question for your poll…",
  whatif: "Set the scene for your alternate universe…",
  image: "Describe what you're sharing…",
};

// ─── Sub-components ────────────────────────────────────────────────────────

function PostTypeTabs({ active, onChange }) {
  const tabs = [
    { id: "story",  label: "Story",   icon: "✍" },
    { id: "poll",   label: "Poll",    icon: "◎" },
    { id: "whatif", label: "What If", icon: "◈" },
    { id: "image",  label: "Image",   icon: "⊞" },
  ];
  return (
    <div className="flex gap-1 bg-[#0F1016] p-1 rounded-xl border border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
            text-sm font-medium border transition-all duration-200
            ${active === tab.id
              ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_14px_rgba(249,115,22,0.22)]"
              : "text-white/40 hover:text-white/65 hover:bg-white/5 border-transparent"
            }`}
        >
          <span className="text-[15px] leading-none">{tab.icon}</span>
          <span className="hidden sm:inline text-[12px]">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function PollSection({ options, setOptions }) {
  return (
    <div className="p-4 rounded-xl bg-[#0F1016] border border-white/5 space-y-2.5">
      <p className="text-[10px] text-white/28 uppercase tracking-widest font-semibold">
        Poll Options
      </p>

      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${i + 1}`}
          className="w-full bg-[#14151A] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white cursor-pointer"
        />
      ))}

      {options.length < 4 && (
        <button
          onClick={() => setOptions([...options, ""])}
          className="w-full py-2 border border-dashed border-white/10 text-white/28 text-sm cursor-pointer"
        >
          + Add option
        </button>
      )}
    </div>
  );
}

function WhatIfSection({value, setValue}) {
  return (
    <div className="p-4 rounded-xl bg-[#0F1016] border border-white/5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-[3px] h-4 rounded-full bg-orange-500 flex-shrink-0" />
        <p className="text-[10px] text-white/28 uppercase tracking-widest font-semibold">
          Alternate Storyline
        </p>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What if Thanos used the infinity gauntlet to create more resources instead of destroying half the universe?"
        className="w-full bg-[#14151A] border border-white/8 rounded-lg px-4 py-3 text-sm cursor-pointer
          text-white placeholder-white/20 resize-none focus:outline-none
          focus:border-orange-500/55 focus:ring-1 focus:ring-orange-500/25 transition-all"
      />
    </div>
  );
}

function ImageSection({ file, setFile }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Optional validation
    if (!selectedFile.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 rounded-xl bg-[#0F1016] border-2 border-dashed border-white/9
      hover:border-orange-500/28 transition-all group cursor-pointer text-center space-y-3"
    >
      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mx-auto w-12 h-12 rounded-xl bg-white/4 group-hover:bg-orange-500/10
        flex items-center justify-center transition-colors text-[22px]">
        🎞
      </div>

      <div>
        <p className="text-sm text-white/55 font-medium group-hover:text-white/75 transition-colors">
          Upload movie posters or images
        </p>
        <p className="text-xs text-white/22 mt-1">
          Click to browse · PNG, JPG up to 10MB
        </p>
      </div>

      {/* Preview */}
      {file && (
        <div className="mt-3">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-36 object-cover rounded-lg mx-auto border border-white/10"
          />
          <p className="text-xs text-green-400 mt-1">{file.name}</p>
        </div>
      )}

      {/* Placeholder grid */}
      {!file && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="aspect-[2/3] rounded-lg bg-white/3 border border-white/5
              flex items-center justify-center text-white/10 text-lg"
            >
              ⊞
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// function MovieTag({ label, onRemove }) {
//   return (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/12
//       border border-orange-500/22 rounded-full text-orange-400 text-xs font-medium">
//       🎬 {label}
//       <button
//         onClick={onRemove}
//         className="text-orange-400/45 hover:text-orange-300 transition-colors leading-none"
//       >
//         ✕
//       </button>
//     </span>
//   );
// }

// function MovieTagging({ tags, onAdd, onRemove }) {
//   const [query, setQuery] = useState("");
//   const [open, setOpen]   = useState(false);

//   const filtered = MOVIE_SUGGESTIONS.filter(
//     (m) => m.toLowerCase().includes(query.toLowerCase()) && !tags.includes(m)
//   );

//   return (
//     <div className="space-y-2">
//       {tags.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {tags.map((t) => (
//             <MovieTag key={t} label={t} onRemove={() => onRemove(t)} />
//           ))}
//         </div>
//       )}
//       <div className="relative">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
//           onFocus={() => setOpen(true)}
//           onBlur={() => setTimeout(() => setOpen(false), 180)}
//           placeholder="🎬  Tag a movie (e.g., Inception)"
//           className="w-full bg-[#14151A] border border-white/8 rounded-lg px-4 py-2.5 text-sm
//             text-white placeholder-white/22 focus:outline-none focus:border-orange-500/55
//             focus:ring-1 focus:ring-orange-500/25 transition-all"
//         />
//         {open && query.length > 0 && filtered.length > 0 && (
//           <div className="absolute z-20 mt-1 w-full bg-[#1A1C24] border border-white/10
//             rounded-xl shadow-2xl overflow-hidden">
//             {filtered.slice(0, 5).map((m) => (
//               <button
//                 key={m}
//                 onMouseDown={() => { onAdd(m); setQuery(""); setOpen(false); }}
//                 className="w-full text-left px-4 py-2.5 text-sm text-white/65
//                   hover:bg-orange-500/10 hover:text-orange-300 transition-colors"
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

function SpoilerToggle({ active, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/65">Mark as Spoiler</p>
          <p className="text-xs text-white/28 mt-0.5">
            Blurs content for users who haven't seen it
          </p>
        </div>
        <button
          onClick={() => onChange(!active)}
          className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
            ${active ? "bg-orange-500" : "bg-white/10"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
              transition-transform duration-300 ${active ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
      {active && (
        <div className="rounded-lg overflow-hidden relative">
          <div className="px-4 py-5 bg-[#1A1C24] text-sm text-white/50 italic text-center
            select-none blur-sm">
            This content contains major plot spoilers that have been intentionally hidden.
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white/55 bg-black/60 px-3 py-1
              rounded-full backdrop-blur-sm border border-white/10">
              🚨 Spoiler Hidden
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBar({ onImageClick, onPollClick, onPost }) {
  const actions = [
    { icon: "🎬", label: "Tag" },
    { icon: "😊", label: "Mood" },
  ];
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/5">
      <div className="flex items-center gap-1">
        {actions.map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            title={label}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/28 hover:text-orange-400 hover:bg-orange-500/9 transition-all"
          >
            <span className="text-sm">{icon}</span>
            <span className="hidden sm:inline text-xs">{label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onPost}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:scale-[1.025] active:scale-[0.975] shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_4px_28px_rgba(249,115,22,0.58)]"
      >
        Post
      </button>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

const CreatePost = () => {
  
  const router = useRouter();

  const [postType, setPostType] = useState("story");
  const [spoiler,  setSpoiler]  = useState(false);
  const [tags,     setTags]     = useState([]);
  const [text,     setText]     = useState("");
  const [posted,   setPosted]   = useState(false);
  const [error,    setError]    = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [whatIfText, setWhatIfText] = useState("");
  const [file, setFile] = useState(null);
  const [title, settitle] = useState("");


const { user } = useAuth();
const username = user?.displayName || "Anonymous";

  const handlePost = async () => {
  try {
    setError("");

    // Validation for poll type
    if (postType === "poll") {
      const nonEmptyOptions = options.filter(opt => opt.trim() !== "");
      if (nonEmptyOptions.length < 2) {
        setError("Poll must have at least 2 options");
        return;
      }
    }

    // Validation for other types
    if (postType !== "poll" && !text.trim() && !file) {
      setError("Please add some content");
      return;
    }

    const formData = new FormData();

    formData.append("avatar", "url_to_avatar");
    formData.append("username", username);
    formData.append("userId", "661e123abc456def78900000");
    formData.append("postedAt", new Date().toISOString());
    formData.append("postType", postType);

    // content logic based on type
    if (postType === "whatif") {
      formData.append("content", whatIfText);
    } else {
      formData.append("content", text);
      formData.append("title", title || text.split("\n")[0] || "Untitled");
    }

    // poll data - only send non-empty options
    if (postType === "poll") {
      const nonEmptyOptions = options.filter(opt => opt.trim() !== "");
      formData.append("pollOptions", JSON.stringify(nonEmptyOptions));
    }

    // file
    if (file) {
      formData.append("media", file);
    }

    const res = await axios.post("http://localhost:8000/api/post/create-post", formData);

    if (res.status !== 201) throw new Error(res.data.message);

    // reset UI
    setPosted(true);
    setText("");
    setWhatIfText("");
    setOptions(["", ""]);
    setFile(null);
    setError("");

    setTimeout(() => setPosted(false), 2500);

    router.push("/");

  } catch (err) {
    setError(err.response?.data?.message || err.message || "Post failed");
    console.error("Post failed:", err);
  }
};

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px]
          rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-[#0B0B0F]/82 backdrop-blur-xl
        border-b border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-700
            flex items-center justify-center text-md font-black text-white">
            🎬
          </div>
          <span className="font-bold text-lg text-white tracking-tight hidden sm:block">
            CineSocial
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          Create a post
        </h1>
        <p className="text-sm text-white/28 mb-7">
          Share theories, reviews, polls, or start a conversation.
        </p>

        {/* Post card */}
        <div className="bg-[#14151A] rounded-2xl border border-white/6 shadow-2xl overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col gap-5">

            {/* User identity */}
            <div className="flex items-center gap-3">
              <div className=' border border-white/10 rounded-[50%] w-10 h-10 overflow-hidden'>
        <img className='' />    {/*avatar*/}
        </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">{username}</p>
                <p className="text-xs text-white/28 mt-0.5">Cinephile · 412 followers</p>
              </div>
              <div className="w-20 border border-white/20 rounded-[20px] px-2 text-center text-sm font-[gilroy]"><h2>Public</h2></div>
            </div>

            {/* Post type tabs */}
            <PostTypeTabs active={postType} onChange={setPostType} />    

            <input className="w-full bg-[#0F1016] border border-white/6 rounded-xl px-4 py-2.5 text-xl text-extrabold font-[gilroy] cursor-pointer
                text-white text-sm leading-relaxed resize-none placeholder-white/20
                focus:outline-none focus:border-orange-500/48 focus:ring-1
                focus:ring-orange-500/18 transition-all duration-200"
              type="text" value={title} onChange={(e) => settitle(e.target.value)} placeholder="Post title" />

            {/* Main textarea */}
            <textarea
              rows={postType === "story" ? 5 : 3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDERS[postType]}
              maxLength={1000}
              className="w-full bg-[#0F1016] border border-white/6 rounded-xl px-4 py-3.5
                text-white text-sm leading-relaxed resize-none placeholder-white/20
                focus:outline-none focus:border-orange-500/48 focus:ring-1
                focus:ring-orange-500/18 transition-all duration-200"
            />

            {/* Dynamic section */}
            {postType === "poll" && (
  <PollSection options={options} setOptions={setOptions} />
)}
            {postType === "whatif" && (
  <WhatIfSection value={whatIfText} setValue={setWhatIfText} />
)}
            {postType === "image" && (
  <ImageSection file={file} setFile={setFile} />
)}

            {/* Spoiler toggle */}
            <div className="p-4 rounded-xl bg-[#0F1016] border border-white/5">
              <SpoilerToggle active={spoiler} onChange={setSpoiler} />
            </div>

            {/* Action bar */}
            <ActionBar
              onImageClick={() => setPostType("image")}
              onPollClick={() => setPostType("poll")}
              onPost={handlePost}
            />

            {/* Success flash */}
            {posted && (
              <div className="text-center py-2 rounded-lg bg-green-500/12 border border-green-500/20
                text-green-400 text-sm font-medium animate-pulse">
                ✓ Post published successfully!
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-center py-2 rounded-lg bg-red-500/12 border border-red-500/20
                text-red-400 text-sm font-medium">
                ✕ {error}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/13 text-xs mt-6">
          By posting, you agree to CineSocial's community guidelines.
        </p>
      </main>
    </div>
  );
}

export default CreatePost;