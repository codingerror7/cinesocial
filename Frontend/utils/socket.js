import { io } from "socket.io-client";
import { getAuthToken, getApiBaseUrl } from "./api.js";

let socket;
let currentToken = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  const token = getAuthToken();
  if (!token) return null;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || getApiBaseUrl();

  if (!socket || currentToken !== token) {
    if (socket) {
      socket.disconnect();
    }

    socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket","polling"],
      auth: {
        token,
      },
    });

    currentToken = token;
  }

  return socket;
};