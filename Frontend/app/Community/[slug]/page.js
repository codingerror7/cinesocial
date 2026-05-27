"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar2 from '@/Components/Navbar2';
import Sidebar from '@/Components/Sidebar';
import MobileTopBar from '@/Components/MobileTopBar';
import Loader from '@/Components/Loader';
import { api } from '@/utils/api.js';
import { SocketProvider } from '@/context/SocketContext.js';
import useCommunityChat from '@/hooks/useCommunityChat.js';
import MessageList from '@/Components/Chat/MessageList';
import ChatInput from '@/Components/Chat/ChatInput';
import TypingIndicator from '@/Components/Chat/TypingIndicator';
import OnlineMembers from '@/Components/Chat/OnlineMembers';
// legacy helper removed: getSocket
import { useAuth } from '@/context/AuthContext.js';

const Page = ({ params }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const communityId = useMemo(() => community?._id || null, [community]);
  const canChat = useMemo(() => {
    if (!community || !user) return false;
    const userId = user._id?.toString();
    const adminId = community.admin?.userId
      ? typeof community.admin.userId === 'object'
        ? community.admin.userId._id?.toString()
        : community.admin.userId?.toString()
      : null;

    return (
      adminId === userId ||
      community.members?.some((memberId) => memberId?.toString() === userId)
    );
  }, [community, user]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError(null);
        const communityRes = await api.get(`/api/community/${params.slug}`);
        const communityData = communityRes.data?.community;
        if (!communityData) {
          throw new Error('Community not found');
        }
        setCommunity(communityData);

        const messagesRes = await api.get(`/api/community/${communityData._id}/messages`);
        setMessages(messagesRes.data?.messages || []);
      } catch (err) {
        console.error('Error loading community:', err);
        setError(err?.response?.data?.message || err.message || 'Unable to load community.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [params.slug]);

  useEffect(() => {
    if (!communityId || !canChat) return;

    const socket = getSocket();
    if (!socket) return;

    const handleRoomJoined = () => setChatError(null);
    const handleRoomError = (message) => setChatError(message);
    const handleCommunityMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.emit('joinRoom', { communityId, userId: user?._id });
    socket.on('roomJoined', handleRoomJoined);
    socket.on('roomError', handleRoomError);
    socket.on('communityMessage', handleCommunityMessage);

    return () => {
      socket.emit('leaveRoom', { communityId });
      socket.off('roomJoined', handleRoomJoined);
      socket.off('roomError', handleRoomError);
      socket.off('communityMessage', handleCommunityMessage);
    };
  }, [communityId, canChat, user?._id]);

  const handleJoinCommunity = async () => {
    if (!user?._id) {
      setJoinError('Please log in to join this community.');
      return;
    }

    try {
      setJoinLoading(true);
      setJoinError(null);
      const response = await api.post('/api/join-community', {
        communityId,
        userId: user._id,
      });

      const updatedCommunity = response.data.community;
      if (updatedCommunity) {
        setCommunity((prev) => ({
          ...prev,
          members: [...(prev?.members || []), user._id],
          membersCount: updatedCommunity.membersCount || (prev?.membersCount || 0) + 1,
        }));
        setChatError(null);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Unable to join community.';
      setJoinError(message);
      console.error('Error joining community:', err);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    // placeholder; chat input handled via useCommunityChat when refactored
    event.preventDefault();
    setNewMessage('');
  };

  const handleBack = () => router.back();

  if (loading) {
    return <Loader message="Loading community chat..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar2 />
        <main className="px-4 py-8">
          <button className="mb-4 px-4 py-2 rounded-xl border border-white/10" onClick={handleBack}>
            Back
          </button>
          <div className="rounded-3xl bg-slate-950/80 p-6 shadow-xl">
            <h1 className="text-2xl font-semibold mb-3">Community unavailable</h1>
            <p className="text-white/70">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#080808] text-white">
      <Navbar2 />
      <MobileTopBar />
      <Sidebar />

      <main className="lg:pl-[17rem] pt-16 sm:pt-20 h-screen">
        <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col">
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <img src={community.communityBanner || '/avatar1.jpg'} alt={community.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-semibold tracking-tight truncate">{community.title}</h1>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">Active</span>
                  </div>
                  <p className="mt-1 text-sm text-white/45 line-clamp-1">{community.description}</p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-white/35">
                    <span>{community.membersCount || 1} members</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>Created by {community.admin?.username || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition-all duration-300 hover:bg-white/[0.06]">Community Info</button>
                <OnlineMembers count={community?.onlineMembers?.length} />
                {!canChat ? (
                  <button onClick={handleJoinCommunity} disabled={joinLoading || !user} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition-all duration-300 hover:bg-emerald-500/15 disabled:opacity-50 disabled:cursor-not-allowed">{joinLoading ? 'Joining...' : user ? 'Join Community' : 'Login to Join'}</button>
                ) : (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Member Chat</div>
                )}
              </div>
            </div>
          </div>

          {!canChat && (
            <div className="sm:hidden px-4 py-4 border-b border-white/10 bg-[#0B0B0B]/95">
              <button
                onClick={handleJoinCommunity}
                disabled={joinLoading || !user}
                className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 transition-all duration-300 hover:bg-emerald-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinLoading ? 'Joining...' : user ? 'Join Community to Chat' : 'Login to Join'}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col">
            {(joinError || chatError) && (
              <div className="px-4 sm:px-6 lg:px-8 pt-4">
                {joinError && (
                  <div className="mb-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{joinError}</div>
                )}
                {chatError && (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">{chatError}</div>
                )}
              </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">
              {!canChat && (
                <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 bg-[#0B0B0B]/90">
                  <p className="text-sm text-white/70">Join the community to enter the chat room and speak with members in real time.</p>
                </div>
              )}

              <SocketProvider>
                <ChatArea community={community} user={user} canChat={canChat} onJoin={handleJoinCommunity} />
              </SocketProvider>

              <div className="border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
                  <form className="flex items-end gap-3" onSubmit={handleSendMessage}>
                    <div className="flex-1 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
                      <textarea
                        placeholder={canChat ? 'Write a message...' : 'Join the community to chat'}
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!canChat}
                        className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed disabled:text-white/40"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!canChat || !newMessage.trim() || chatLoading}
                      className="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chatLoading ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                  <p className="mt-3 text-center text-xs text-white/30">Keep conversations respectful and meaningful.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
