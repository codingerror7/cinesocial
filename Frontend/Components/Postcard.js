"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Postcard = ({ variant = "default"}) => {
  const [postData, setpostData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get('http://localhost:8000/api/post/feed');
        setpostData(response.data?.post || []);
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
    <div className="p-4 border border-white/10 rounded-xl mb-4">
      
      <div className='w-full flex items-center justify-between '>
      <h2 className="text-lg font-bold text-white/70">
        {post.user.userName}
      </h2>
      <p className="text-sm text-white/70">
        {post.postType === "poll" ? "📊 Poll" : "📝 Post"}
      </p>
      </div>

      <p className="text-white mt-2">
        {post.content}
      </p>

      {/* media */}
      {post.media?.length > 0 && (
        <img
          src={post.media[0]}
          alt="post"
          className="mt-3 rounded-lg"
        />
      )}

      {/* poll */}
      {post.postType === "poll" && (
        <div className="mt-3 space-y-1">
          {post.pollOptions.map((opt, i) => (
            <div key={i} className="text-sm bg-white/5 p-2 rounded">
              {opt}
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-white/70 py-2 border-t border-white/10 mt-3">
        {new Date(post.postedAt).toLocaleString()}
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