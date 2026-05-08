"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';     //image optimization in nextjs, lazy loading, responsive images, making images light-weight and more efficient image handling.

const Postcard = () => {
  const [postData, setpostData] = useState([]);   //jab multiple data backend se aa rha hai tab empty array use krte hain and jab single document aa rha hai tab null use krte hain.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/post/feed');
        const posts = response.data.post;
        console.log("Raw posts from backend:", posts);

        // Process posts and ensure avatars are available
        const processedPosts = posts.map((post) => {
          // Use avatar from post data, or provide a default
          let avatar = post.user?.avatar && post.user.avatar.trim() !== "" && post.user.avatar !== " " && post.user.avatar !== "url_to_avatar"
            ? post.user.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.userName || "Anonymous")}&background=6366f1&color=fff&size=128`;

          // If avatar is a relative path (starts with /), make it a full URL
          if (avatar.startsWith('/avatar')) {
            avatar = `http://localhost:3000${avatar}`;
          }

          return {
            ...post,
            user: {
              ...post.user,
              avatar: avatar,
              userName: post.user?.userName || "Anonymous",
              title: post.user?.title || "Cinephile",
            }
          };
        });

        console.log("Processed posts with avatars:", processedPosts);
        setpostData(processedPosts);
      } catch (error) {
        console.error('Error fetching post data:', error);
        setpostData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVote = async (postId, optionIndex) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/post/vote/${postId}`,
      { optionIndex }
    );

    // update feed state
    setpostData(prev =>
      prev.map(p =>
        p._id === postId ? res.data.post : p
      )
    );

  } catch (err) {
    console.error("Vote failed:", err.message);
  }
};

//     function ActionBtn({ icon, count, active = false }) {
//   return (
//     <button
//       className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition
//         ${active 
//           ? "text-red-500 hover:bg-red-500/10" 
//           : "text-white/60 hover:text-white hover:bg-white/5"
//         }`}
//     >
//       <span>{icon}</span>
//       <span className="text-xs">{count}</span>
//     </button>
//   );
// }
  return (
  <>
    <div className="w-full max-sm:px-0 overflow-x-hidden">
      {loading ? (
        <p className="text-center text-sm sm:text-base text-white/70 py-6 overflow-hidden">
          Loading...
        </p>
      ) : (
        Array.isArray(postData) &&
        postData.map((post) => (
          <div
            key={post._id}
            className="p-3 sm:p-4 border border-white/10 rounded-2xl mb-4 bg-black/30 font-[gilroy] w-full overflow-hidden max-sm:rounded-xl"
          >
            {/* TOP */}
            <div className="w-full flex items-start justify-between gap-3">
              
              {/* LEFT */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="border border-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                  {post.user?.avatar ? (
                    <Image
                      className="rounded-full object-cover w-full h-full"
                      src={post.user.avatar}
                      alt="avatar"
                      width={44}
                      height={44}
                      onError={(e) => {
                        console.log("Avatar failed to load, using fallback");
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.innerHTML =
                          '<span class="text-lg">👤</span>';
                      }}
                      unoptimized={post.user.avatar.startsWith(
                        "http://localhost:3000"
                      )}
                    />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>

                <div className="flex flex-col min-w-0 overflow-hidden">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-white/80 truncate">
                    {post.user?.userName || "Anonymous"}
                  </h2>

                  <span className="text-[10px] sm:text-xs text-white/40 font-normal truncate">
                    {post.user?.title || "Cinephile"}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <p className="text-[10px] sm:text-sm text-white/70 whitespace-nowrap shrink-0">
                {post.postType === "poll" ? "📊 Poll" : "📝 Post"}
              </p>
            </div>

            {/* TITLE */}
            <h1 className="text-[17px] sm:text-xl font-bold text-white mt-4 px-1 sm:px-3 leading-snug break-words">
              {post.title || "Untitled"}
            </h1>

            {/* CONTENT */}
            <p className="text-[13px] sm:text-base text-white/85 mt-2 px-1 sm:px-3 py-1 leading-relaxed break-words whitespace-pre-wrap">
              {post.content}
            </p>

            {/* MEDIA */}
            {post.media?.length > 0 &&
              post.media[0] &&
              typeof post.media[0] === "string" &&
              post.media[0].trim() !== "" && (
                <div className="relative mt-3 mb-2">
                  <div className="relative w-full bg-black/30 rounded-xl overflow-hidden">
                    <Image
                      src={post.media[0]}
                      alt="post media"
                      width={800}
                      height={600}
                      className="rounded-xl w-full h-auto object-cover max-h-[520px] max-sm:max-h-[350px]"
                      priority={false}
                      quality={75}
                      unoptimized={true}
                      onError={(e) => {
                        console.error(
                          "Image failed to load from URL:",
                          post.media[0]
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  {/* MEDIA USER OVERLAY */}
                  <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full max-w-[80%]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                      {post.user?.avatar ? (
                        <Image
                          src={post.user.avatar}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-full h-full"
                          onError={(e) => {
                            console.log(
                              "Overlay avatar failed to load, using fallback"
                            );
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.innerHTML =
                              '<span class="text-sm">👤</span>';
                          }}
                          unoptimized={post.user.avatar.startsWith(
                            "http://localhost:3000"
                          )}
                        />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>

                    <span className="text-[10px] sm:text-xs text-white/90 font-semibold truncate">
                      {post.user?.userName || "Anonymous"}
                    </span>
                  </div>
                </div>
              )}

            {/* POLL */}
            {post.postType === "poll" && post.poll?.options && (
              <div className="mt-3 space-y-2">
                {post.poll.options.map((opt, i) => {
                  const totalVotes = post.poll.options.reduce(
                    (sum, o) => sum + o.votes,
                    0
                  );

                  const percentage = totalVotes
                    ? Math.round((opt.votes / totalVotes) * 100)
                    : 0;

                  return (
                    <div
                      key={i}
                      onClick={() => handleVote(post._id, i)}
                      className="relative p-2.5 sm:p-3 bg-white/5 rounded-xl cursor-pointer overflow-hidden"
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-orange-500/30"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative flex items-center justify-between gap-3">
                        <span className="text-[13px] sm:text-base text-white break-words flex-1">
                          {opt.text}
                        </span>

                        <span className="text-[11px] sm:text-sm text-white/80 shrink-0">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DATE */}
            <p className="text-[10px] sm:text-sm text-white/60 py-2 border-t border-white/10 mt-4">
              {new Date(post.postedAt)
                .toDateString()
                .split(" ")
                .slice(1, 4)
                .join("-")}
            </p>
          </div>
        ))
      )}
    </div>
  </>
);
}

export default Postcard;