"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api.js';
import { SocketProvider } from '@/context/SocketContext.js';
import useCommunityChat from '@/hooks/useCommunityChat.js';
import MessageList from '@/Components/Chat/MessageList';
import ChatInput from '@/Components/Chat/ChatInput';
import TypingIndicator from '@/Components/Chat/TypingIndicator';
import { useAuth } from '@/context/AuthContext.js';
import Loader from '@/Components/Loader';

const ChatInner = ({ communityId, user, canChat, onJoin, joinLoading, joinError }) => {
  const { messages, loading: chatLoading, sending, sendMessage, typingUsers, scrollRef, join: joinSocket, connected, startTyping, stopTyping } = useCommunityChat({ communityId, user });

  useEffect(() => {
    if (canChat && connected) {
      joinSocket?.();
    }
  }, [canChat, connected, joinSocket]);

  if (!canChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-white/70">Join the community to start chatting.</p>
        <button
          type="button"
          onClick={onJoin}
          disabled={joinLoading}
          className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joinLoading ? 'Joining...' : 'Join Community'}
        </button>
        {joinError ? <p className="mt-3 text-sm text-rose-300">{joinError}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {chatLoading ? (
        <div className="p-6">Loading messages...</div>
      ) : (
        <>
          <MessageList messages={messages} user={user} containerRef={scrollRef} />
          <TypingIndicator users={typingUsers} />
          <div className="border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
              <ChatInput
                onSend={sendMessage}
                disabled={!connected || sending}
                onStartTyping={startTyping}
                onStopTyping={stopTyping}
              />
              <p className="mt-3 text-center text-xs text-white/30">Keep conversations respectful and meaningful.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CommunityContent = ({ initialCommunity }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [community, setCommunity] = useState(initialCommunity || null);
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const communityId = useMemo(() => community?._id || null, [community]);

  const canChat = useMemo(() => {
    if (!community || !user) return false;
    const userId = user._id?.toString();
    const adminId = community.admin?.userId
      ? typeof community.admin.userId === 'object'
        ? community.admin.userId._id?.toString()
        : community.admin.userId?.toString()
      : null;
    return adminId === userId || community.members?.some((m) => m?.toString() === userId);
  }, [community, user]);

  const handleJoinCommunity = async () => {
    if (!user?._id) {
      setJoinError('Please log in');
      return;
    }
    try {
      setJoinLoading(true);
      setJoinError(null);
      const res = await api.post('/api/join-community', { communityId, userId: user._id });
      if (res.data?.community) {
        setCommunity((p) => ({ ...(p || {}), members: [...(p?.members || []), user._id], membersCount: res.data.community.membersCount }));
      }
    } catch (err) {
      setJoinError(err?.response?.data?.message || 'Failed to join');
    } finally {
      setJoinLoading(false);
    }
  };

  if (!community) return <Loader message="Loading community..." />;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <SocketProvider>
        <ChatInner
          communityId={communityId}
          user={user}
          canChat={canChat}
          onJoin={handleJoinCommunity}
          joinLoading={joinLoading}
          joinError={joinError}
        />
      </SocketProvider>
    </div>
  );
};

export default CommunityContent;