import { io } from "socket.io-client";

let socket;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getSocket = () => {
  if (typeof window === "undefined") return null;
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
};