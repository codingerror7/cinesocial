"use client";
import React from 'react';
import useCommunityChat from '@/hooks/useCommunityChat.js';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const ChatArea = ({ community, user, canChat, onJoin }) => {
  const { messages, loading, sending, sendMessage, typingUsers, scrollRef, join } = useCommunityChat({ communityId: community?._id, user });

  React.useEffect(() => { if (canChat) { join?.(); } }, [canChat]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {loading ? (
        <div className="p-6">Loading messages...</div>
      ) : (
        <>
          <MessageList messages={messages} user={user} containerRef={scrollRef} />
          <TypingIndicator users={typingUsers} />
          <div className="border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
              <ChatInput value={''} onChange={() => {}} onSend={sendMessage} disabled={!canChat} onStartTyping={() => {}} onStopTyping={() => {}} />
              <p className="mt-3 text-center text-xs text-white/30">Keep conversations respectful and meaningful.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatArea;
