"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used inside SocketProvider');
  return ctx;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    // lazy init on client
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken') || localStorage.getItem('accesstoken');
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000`;
    setConnecting(true);
    const s = io(url, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    const onConnect = () => {
      setConnected(true);
      setConnecting(false);
      reconnectAttempts.current = 0;
    };
    const onDisconnect = () => setConnected(false);
    const onReconnectAttempt = (n) => { reconnectAttempts.current = n; };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.io && s.io.on && s.io.on('reconnect_attempt', onReconnectAttempt);

    setSocket(s);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      if (s.io && s.io.off) s.io.off('reconnect_attempt', onReconnectAttempt);
      s.disconnect();
      setSocket(null);
    };
  }, []);

  const value = useMemo(() => ({ socket, connected, connecting, reconnectAttempts }), [socket, connected, connecting]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
