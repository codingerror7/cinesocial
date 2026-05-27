"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import useSocket from './useSocket.js';
import { api } from '@/utils/api.js';

const EVENTS = {
  CLIENT: {
    JOIN: 'join-community',
    LEAVE: 'leave-community',
    SEND_MESSAGE: 'send-message',
    TYPING_START: 'typing-start',
    TYPING_STOP: 'typing-stop',
    MARK_READ: 'mark-read'
  },
  SERVER: {
    ROOM_JOINED: 'room-joined',
    NEW_MESSAGE: 'new-message',
    USER_TYPING: 'user-typing',
    USER_STOPPED_TYPING: 'user-stopped-typing',
    ONLINE_MEMBERS: 'online-members',
    MESSAGE_ERROR: 'message-error'
  }
};

export const useCommunityChat = ({ communityId, user }) => {
  const { socket, emit, on, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pendingRefs = useRef(new Map());
  const scrollRef = useRef(null);

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/community/${communityId}/messages`);
      setMessages(res.data?.messages || []);
      setHasMore(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => { if (communityId) loadInitial(); }, [communityId, loadInitial]);

  useEffect(() => {
    if (!socket || !communityId) return;

    const handleNewMessage = (msg) => {
      // prevent duplicates by _id
      setMessages((prev) => {
        if (prev.some(m => m._id && msg._id && m._id.toString() === msg._id.toString())) return prev;
        return [...prev, msg];
      });
      // cleanup optimistic
      if (msg._clientTempId) pendingRefs.current.delete(msg._clientTempId);
      // auto-scroll
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    };

    const handleTyping = ({ user }) => {
      setTypingUsers((prev) => Array.from(new Set([...prev.filter(u=>u._id!==user._id), user])));
    };
    const handleStopTyping = ({ user }) => {
      setTypingUsers((prev) => prev.filter(u => u._id !== user._id));
    };
    const handleOnline = ({ communityId: cid }) => {
      // request server for online count via API or event, simplified here
      // server emits ONLINE_MEMBERS; client can call endpoint to fetch count
      // for now, leave to event payload
    };

    socket.on(EVENTS.SERVER.NEW_MESSAGE, handleNewMessage);
    socket.on(EVENTS.SERVER.USER_TYPING, handleTyping);
    socket.on(EVENTS.SERVER.USER_STOPPED_TYPING, handleStopTyping);
    socket.on(EVENTS.SERVER.ONLINE_MEMBERS, handleOnline);

    return () => {
      socket.off(EVENTS.SERVER.NEW_MESSAGE, handleNewMessage);
      socket.off(EVENTS.SERVER.USER_TYPING, handleTyping);
      socket.off(EVENTS.SERVER.USER_STOPPED_TYPING, handleStopTyping);
      socket.off(EVENTS.SERVER.ONLINE_MEMBERS, handleOnline);
    };
  }, [socket, communityId]);

  const join = async () => {
    if (!socket) throw new Error('Socket not connected');
    return emit(EVENTS.CLIENT.JOIN, { communityId });
  };

  const leave = async () => {
    if (!socket) return;
    return emit(EVENTS.CLIENT.LEAVE, { communityId });
  };

  const sendMessage = async (text) => {
    if (!socket) throw new Error('Socket not ready');
    const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const optimistic = { _id: tempId, message: text, sender: user?._id, username: user?.name || user?.userName || 'You', avatar: user?.avatar || '', createdAt: new Date().toISOString(), pending: true };
    setMessages(prev => [...prev, optimistic]);
    pendingRefs.current.set(tempId, optimistic);
    setSending(true);
    const res = await emit(EVENTS.CLIENT.SEND_MESSAGE, { communityId, message: text });
    setSending(false);
    if (!res || !res.ok) {
      setError(res?.error || 'send_failed');
      // mark optimistic as failed
      setMessages(prev => prev.map(m => m._id === tempId ? { ...m, failed: true } : m));
      return null;
    }
    // replace optimistic with server message
    setMessages(prev => prev.map(m => (m._id === tempId ? res.message : m)));
    pendingRefs.current.delete(tempId);
    return res.message;
  };

  const startTyping = () => { socket?.emit(EVENTS.CLIENT.TYPING_START, { communityId }); };
  const stopTyping = () => { socket?.emit(EVENTS.CLIENT.TYPING_STOP, { communityId }); };

  return {
    messages,
    loading,
    sending,
    error,
    typingUsers,
    onlineCount,
    hasMore,
    join,
    leave,
    sendMessage,
    startTyping,
    stopTyping,
    scrollRef
  };
};

export default useCommunityChat;
