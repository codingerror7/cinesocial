"use client"
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.js"; // Update the path as needed
import { api } from "@/utils/api.js";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar2 from "./Navbar2.js";
import MobileTopBar from "./MobileTopBar.js";
import Sidebar from "./Sidebar.js";

const PLACEHOLDERS = {
  story: "Share your thoughts on a movie, theory, or idea…",
  poll: "Ask a question for your poll…",
  whatif: "Set the scene for your alternate universe…",
  image: "Describe what you're sharing…",
};

function PostTypeTabs({ active, onChange }) {
  const tabs = [
    { id: "story",  label: "Story",   icon: "✍" },
    { id: "poll",   label: "Poll",    icon: "◎" },
    { id: "whatif", label: "What If", icon: "◈" },
    { id: "image",  label: "Image",   icon: "⊞" },
  ];
  return (
    <div className="flex gap-2 bg-white/1 p-2 rounded-xl border border-white/5 w-full overflow-x-auto scrollbar-hide">
  
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => onChange(tab.id)}
      className={`flex-1 min-w-[64px] sm:min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg
      text-[11px] sm:text-sm font-medium border transition-all duration-200 whitespace-nowrap
      ${
        active === tab.id
          ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_14px_rgba(249,115,22,0.22)]"
          : "text-white/40 hover:text-white/65 hover:bg-white/5 border-transparent"
      }`}
    >
      
      <span className="text-[16px] sm:text-[15px] leading-none shrink-0">
        {tab.icon}
      </span>

      <span className="text-[10px] sm:text-[12px] leading-none">
        {tab.label}
      </span>
    </button>
  ))}
</div>
  );
}

function PollSection({ options, setOptions }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white/1 border border-white/5 space-y-2.5 w-full overflow-hidden">
  
  <p className="text-[9px] sm:text-[10px] text-white/28 uppercase tracking-widest font-semibold">
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
      className="w-full bg-[#14151A] border border-white/8 rounded-lg px-3 sm:px-4 py-2.5 text-[13px] sm:text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/30"
    />
  ))}

  {options.length < 4 && (
    <button
      onClick={() => setOptions([...options, ""])}
      className="w-full py-2.5 border border-dashed border-white/10 text-white/28 text-[13px] sm:text-sm rounded-lg hover:bg-white/[0.03] transition cursor-pointer"
    >
      + Add option
    </button>
  )}
</div>
  );
}

function WhatIfSection({value, setValue}) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white/1 border border-white/5 space-y-3 w-full overflow-hidden">
  
  <div className="flex items-center gap-2">
    
    <div className="w-[3px] h-4 rounded-full bg-orange-500 flex-shrink-0" />

    <p className="text-[9px] sm:text-[10px] text-white/28 uppercase tracking-[2px] sm:tracking-widest font-semibold">
      Alternate Storyline
    </p>
  </div>

  <textarea
    rows={3}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="What if Thanos used the infinity gauntlet to create more resources instead of destroying half the universe?"
    className="w-full min-h-[110px] sm:min-h-[120px] bg-[#14151A] border border-white/8 rounded-lg px-3 sm:px-4 py-3 text-[13px] sm:text-sm cursor-pointer
    text-white placeholder-white/20 resize-none focus:outline-none
    focus:border-orange-500/55 focus:ring-1 focus:ring-orange-500/25 transition-all leading-relaxed"
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
        <div className="mt-3 flex justify-center">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full max-w-[180px] aspect-[2/3] object-cover rounded-lg border border-white/10"
          />
          <p className="text-xs text-green-400 mt-1">{file.name}</p>
        </div>
      )}

      {/* Placeholder grid */}
      {!file && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
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


function SpoilerToggle({ active, onChange }) {
  return (
    <div className="space-y-3 w-full overflow-hidden">
  
  {/* TOP */}
  <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
    
    {/* TEXT */}
    <div className="min-w-0 flex-1">
      
      <p className="text-[13px] sm:text-sm font-medium text-white/65 leading-snug">
        Mark as Spoiler
      </p>

      <p className="text-[11px] sm:text-xs text-white/28 mt-0.5 leading-relaxed">
        Coming soon!
      </p>
    </div>

    {/* TOGGLE */}
    <button
      onClick={() => onChange(!active)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
      ${active ? "bg-orange-500" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
        transition-transform duration-300 ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>

  {/* SPOILER PREVIEW */}
  {active && (
    <div className="rounded-lg overflow-hidden relative">
      
      <div
        className="px-3 sm:px-4 py-4 sm:py-5 bg-[#1A1C24] text-[12px] sm:text-sm text-white/50 italic text-center
        select-none blur-sm leading-relaxed"
      >
        This content contains major plot spoilers that have been intentionally hidden.
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-3">
        
        <span
          className="text-[10px] sm:text-xs font-semibold text-white/55 bg-black/60 px-3 py-1
          rounded-full backdrop-blur-sm border border-white/10 text-center"
        >
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5 w-full overflow-hidden">
  
  {/* ACTIONS */}
  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto">
    
    {actions.map(({ icon, label, onClick }) => (
      <button
        key={label}
        onClick={onClick}
        title={label}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white/28 hover:text-orange-400 hover:bg-orange-500/9 transition-all whitespace-nowrap shrink-0"
      >
        
        <span className="text-sm sm:text-base leading-none">
          {icon}
        </span>

        <span className="text-[11px] sm:text-xs">
          {label}
        </span>
      </button>
    ))}
  </div>

  {/* POST BUTTON */}
  <button
    onClick={onPost}
    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:scale-[1.025] active:scale-[0.975] shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_4px_28px_rgba(249,115,22,0.58)]"
  >
    Post
  </button>
</div>
  );
}

// --- Main Page 
//--------------------------------------------------------

const CreatePost = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
    if (!storedUser?._id) {
      router.push("/Login");
    }
  }, [user, router]);

  const params = useParams();
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
  const [profile, setprofile] = useState(null);

  const handlePostTypeChange = (type) => {
    setPostType(type);
    if (type !== "poll") {
      setOptions(["", ""]);
    }
    if (type !== "whatif") {
      setWhatIfText("");
    }
    if (type === "whatif") {
      setText("");
    }
  };

  // Get user avatar from context or localStorage, with proper fallback
  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const currentUser = user || storedUser;
  
  // Use avatar from context/storage, or generate one
  const computedAvatar = (currentUser?.avatar && String(currentUser.avatar).trim()) 
    ? String(currentUser.avatar).trim()
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || currentUser?.displayName || 'Anonymous')}&background=6366f1&color=fff&size=128`;
  
  const avatar = computedAvatar || profile?.avatar;
  const username = currentUser?.name || currentUser?.displayName || profile?.name || "Anonymous";
  const titleName = currentUser?.title || profile?.title || "Cinephile";

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
      if (!text.trim()) {
        setError("Poll question is required");
        return;
      }
    }

    // Validation for What If type
    if (postType === "whatif") {
      if (!whatIfText.trim()) {
        setError("Please add some content for your What If scenario");
        return;
      }
    }

    // Validation for story/image type
    if (postType !== "poll" && postType !== "whatif" && !text.trim() && !file) {
      setError("Please add some content");
      return;
    }

    const formData = new FormData();

    // Generate a consistent userId if none exists. Prefer the Mongo `_id` saved in localStorage.
    let userId = user?._id || user?.id || user?.uid;
    if (!userId || userId === "anonymous") {
      // Generate a temporary userId for anonymous users
      userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate avatar URL if not available
    let userAvatar = avatar;
    if (!userAvatar || userAvatar.trim() === "") {
      userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "Anonymous")}&background=6366f1&color=fff&size=128`;
    }

    formData.append("avatar", userAvatar);
    formData.append("username", username);
    formData.append("userId", userId);
    formData.append("postedAt", new Date().toISOString());
    formData.append("postType", postType);

    // content logic based on type
    const contentValue = postType === "whatif" ? whatIfText : text;
    formData.append("content", contentValue);
    formData.append("title", title || contentValue.split("\n")[0] || "Untitled");

    // poll data - only send non-empty options
    if (postType === "poll") {
      const nonEmptyOptions = options.filter(opt => opt.trim() !== "");
      formData.append("pollOptions", JSON.stringify(nonEmptyOptions));
    }

    // file - IMPORTANT: field name must match multer field "media"
    if (file) {
      console.log("Appending file to FormData:", file.name, file.size, file.type);
      formData.append("media", file);
    }

    console.log("📤 Sending post data:", {
      username,
      userId,
      postType,
      hasFile: !!file,
      fileName: file?.name,
      contentLength: text?.length || whatIfText?.length
    });

    const response = await api.post("/api/post/create-post", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000
    });

    console.log("✓ Post created successfully:", response.data);

    if (response.status !== 201) {
      throw new Error(response.data.message || "Failed to create post");
    }

    // reset UI
    setPosted(true);
    setText("");
    setWhatIfText("");
    setOptions(["", ""]);
    setFile(null);
    setError("");
    settitle("");

    setTimeout(() => setPosted(false), 2500);

    router.push("/");

  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Post failed";
    setError(errorMessage);
    console.error("❌ Post failed:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
  }
};

useEffect(()=>{
  const id = params?.id;
  if(!id){
    console.log("id missing");
    return;
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/get-profile/${id}`);
      setprofile(res.data);
    } catch (error) {
      console.log("failed to fetch data");
      setprofile(null);
    }
  }
  fetchProfile();
},[params])


  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white font-sans overflow-x-hidden">

  {/* Main content */}
  <main
    className="relative z-10
  w-full
  max-w-2xl
  mx-auto
  px-3
  sm:px-5
  lg:px-6
  pt-22
  sm:pt-28
  pb-28
  sm:pb-14
  lg:ml-64
  overflow-x-hidden"
  >

    {/* Heading */}
    <div className="mb-6 sm:mb-8">
      
      <h1
        className="text-[26px] sm:text-3xl font-bold tracking-tight text-white leading-tight"
      >
        Create a post
      </h1>

      <p
        className="text-[12px] sm:text-sm text-white/35 mt-2 leading-relaxed max-w-md"
      >
        Share theories, reviews, polls, or start a conversation.
      </p>
    </div>

    {/* Post card */}
    <div
      className="bg-black/40 border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl overflow-hidden"
    >
      
      <div className="p-3 sm:p-6 flex flex-col gap-5">

        {/* User identity */}
        <div className="flex items-center justify-between gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0 flex-1">

            {/* Avatar */}
            <div
              className="border border-white/10 rounded-full 
              w-13 h-13 sm:w-12 sm:h-12 overflow-hidden 
              bg-white/5 flex items-center justify-center shrink-0"
            >
              {avatar ? (
                <img
                  src={avatar}
                  className="object-cover w-full h-full"
                  alt="avatar"
                />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0 overflow-hidden">

              <p
                className="font-semibold text-[14px] sm:text-base text-white truncate"
              >
                {username}
              </p>

              <p
                className="text-[10px] sm:text-xs text-white/35 mt-0.5 truncate"
              >
                {titleName}
              </p>
            </div>
          </div>

          {/* Public tag */}
          <div
            className="border border-white/15 bg-white/1
            rounded-full px-3 py-1
            text-[10px] sm:text-xs font-medium text-white/70
            shrink-0"
          >
            Public
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden">
          <PostTypeTabs
            active={postType}
            onChange={handlePostTypeChange}
          />
        </div>

        {/* Title */}
        <input
          className="w-full bg-white/1 border border-white/6 rounded-xl 
          px-4 py-3 text-[15px] sm:text-lg font-bold font-[gilroy]
          text-white placeholder-white/20
          focus:outline-none focus:border-orange-500/50 focus:ring-1
          focus:ring-orange-500/20 transition-all duration-200"
          type="text"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          placeholder="Post title"
        />

        {/* Main textarea */}
        {postType !== "whatif" && (
          <textarea
            rows={postType === "story" ? 5 : 4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDERS[postType]}
            maxLength={1000}
            className="w-full bg-white/1 border border-white/6 rounded-xl 
            px-4 py-3.5 text-[13px] sm:text-sm leading-relaxed resize-none 
            placeholder-white/20 text-white
            focus:outline-none focus:border-orange-500/50 focus:ring-1
            focus:ring-orange-500/20 transition-all duration-200"
          />
        )}

        {/* Dynamic sections */}
        <div className="space-y-4 overflow-hidden">
          
          {postType === "poll" && (
            <PollSection
              options={options}
              setOptions={setOptions}
            />
          )}

          {postType === "whatif" && (
            <WhatIfSection
              value={whatIfText}
              setValue={setWhatIfText}
            />
          )}

          {postType === "image" && (
            <ImageSection
              file={file}
              setFile={setFile}
            />
          )}
        </div>

        {/* Spoiler */}
        <div
          className="p-3 sm:p-4 rounded-xl bg-white/1
          border border-white/5"
        >
          <SpoilerToggle
            active={spoiler}
            onChange={setSpoiler}
          />
        </div>

        {/* Action bar */}
        <div className="overflow-hidden">
          <ActionBar
            onImageClick={() => handlePostTypeChange("image")}
            onPollClick={() => handlePostTypeChange("poll")}
            onPost={handlePost}
          />
        </div>

        {/* Success */}
        {posted && (
          <div
            className="text-center py-2.5 rounded-xl 
            bg-green-500/12 border border-green-500/20
            text-green-400 text-[12px] sm:text-sm 
            font-medium animate-pulse"
          >
            ✓ Post published successfully!
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="text-center py-2.5 rounded-xl 
            bg-red-500/12 border border-red-500/20
            text-red-400 text-[12px] sm:text-sm 
            font-medium break-words"
          >
            ✕ {error}
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <p
      className="text-center text-white/15 
      text-[10px] sm:text-xs 
      mt-6 px-3 leading-relaxed"
    >
      By posting, you agree to CineSocial's community guidelines.
    </p>
  </main>
</div>
  );
}

export default CreatePost;