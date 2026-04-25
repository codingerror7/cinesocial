"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';     //image optimization in nextjs, lazy loading, responsive images, making images light-weight and more efficient image handling.
import axios from 'axios';

const Postcard = ({ variant = "default"}) => {
  const [postData, setpostData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get('http://localhost:8000/api/post/feed');
        
          setpostData(response.data.post);

        console.log("Fetched post data:", response.data.post);
      } catch (error) {
        console.error('Error fetching post data:', error);
        setpostData([]);
      }
      finally{
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
    <div>
      
     {loading ? (
  <p>Loading...</p>
) : (
  Array.isArray(postData) && postData.map((post) => (
    <div key={post._id} className="p-4 border border-white/10 rounded-xl mb-4 bg-white/2 font-[gilroy]">
      
      <div className='w-full flex items-center justify-between'>
      <div className='flex items-center justify-between gap-2'>
        <div className=' border border-white/10 rounded-[50%] w-10 h-10 overflow-hidden bg-white/5 flex items-center justify-center'>
        {post.user.avatar && post.user.avatar.startsWith('http') ? (
          <Image className='' src={post.user.avatar} alt="avatar" width={40} height={40} />
        ) : (
          <span className="text-lg">👤</span>
        )}
        </div>
        <h2 className="text-lg font-bold text-white/70">
        {post.user.userName}
      </h2>

      </div>
      <p className="text-sm text-white/70">
        {post.postType === "poll" ? "📊 Poll" : "📝 Post"}
      </p>
      </div>
      <h1 className="text-xl font-bold text-white mt-4 px-3">{post.title}</h1>

      <p className="text-white mt-1 px-3 py-1">
        {post.content}
      </p>

      {/* media */}
      {post.media?.length > 0 && post.media[0] && post.media[0].startsWith('http') && (
        <img
          src={post.media[0]}
          alt="post"
          className="mt-3 rounded-lg"
        />
      )}

      {/* poll */}
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
          className="relative p-2 bg-white/5 rounded cursor-pointer"
        >
          <div
            className="absolute top-0 left-0 h-full bg-orange-500/30"
            style={{ width: `${percentage}%` }}
          />

          <div className="relative flex justify-between">
            <span>{opt.text}</span>
            <span>{percentage}%</span>
          </div>
        </div>
      );
    })}
  </div>
)}
      <p className="text-sm text-white/70 py-2 border-t border-white/10 mt-4">
        {new Date(post.postedAt).toDateString().split(" ").slice(1, 4).join("-")}
      </p>

    </div>
  ))
)}

        {/* SPOILER BLOCK
        {variant === "spoiler" && (
          <div className="mt-3 p-3 border border-white/10 bg-white/5 rounded-md relative">
            
            <div className="text-[10px] mb-2 px-2 py-1 inline-block rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase font-bold">
              ⚠️ Spoiler
            </div>

            <p className="text-xs text-white/60 blur-sm">
              The final conversation between Oppenheimer and Einstein...
            </p>

            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
              👁 Tap to reveal spoiler
            </div>

          </div>
        )}
      </div> */}

      {/* MOVIE CARD */}
      {/* <div className="mx-4 mb-4 flex gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
        

      </div> */}

      {/* ACTIONS */}
      {/* <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        
        <ActionBtn icon="❤️" count="2.4k" active />
        <ActionBtn icon="💬" count="318" />
        <ActionBtn icon="🔄" count="94" />

        <div className="flex-1" /> */}

        {/* <button className="text-sm text-white/60 hover:text-white">
          🔖
        </button> */}
      </div>
    </>
  )
}

export default Postcard;