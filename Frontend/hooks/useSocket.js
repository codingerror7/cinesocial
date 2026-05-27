"use client";
import { useSocketContext } from '@/context/SocketContext.js';

export const useSocket = () => {
  const { socket, connected, connecting, reconnectAttempts } = useSocketContext();

  const emit = (event, payload, ack) => {
    if (!socket) return Promise.reject(new Error('socket not available'));
    return new Promise((resolve) => {
      socket.emit(event, payload, (res) => {
        if (ack) ack(res);
        resolve(res);
      });
    });
  };

  const on = (event, handler) => {
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  };

  return { socket, connected, connecting, reconnectAttempts, emit, on };
};

export default useSocket;
