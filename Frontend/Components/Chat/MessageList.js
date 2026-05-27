"use client";
import React, { useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, user, containerRef }) => {
  useEffect(() => {
    // scroll to bottom when messages change
    const el = containerRef?.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, containerRef]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-4xl flex flex-col gap-5">
        <div className="flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs text-white/35">Today</span><div className="h-px flex-1 bg-white/10" /></div>
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} isMine={user && m.sender?.toString() === user._id?.toString() || user && m.user?.toString() === user._id?.toString() || m._id?.startsWith('tmp_') && m.sender === user?._id} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
