"use client";
import React from 'react';

const MessageBubble = ({ message, isMine }) => {
  return (
    <div className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
      {!isMine && (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10">
          <img src={message.avatar || '/avatar1.jpg'} alt={message.username || 'Member'} className="h-full w-full object-cover" />
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 border ${isMine ? 'bg-white text-black border-white' : 'bg-[#111111] border-white/10 text-white'}`}>
        {!isMine && <p className="mb-1 text-xs font-medium text-white/45">{message.username || 'Member'}</p>}
        <p className="text-sm sm:text-[15px] leading-relaxed break-words">{message.message || message.text}</p>
        <div className={`mt-2 text-[11px] ${isMine ? 'text-black/50' : 'text-white/35'}`}>{new Date(message.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
