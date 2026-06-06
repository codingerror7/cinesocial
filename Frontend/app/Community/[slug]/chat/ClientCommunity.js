"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/utils/socket";
import { api } from "@/utils/api.js";
import { useAuth } from "@/context/AuthContext.js";

const isCommunityMember = (community, userId) => {
  if (!community || !userId) return false;
  const memberIds = Array.isArray(community.members)
    ? community.members.map((id) => String(id))
    : [];
  const adminId = community?.admin?.userId ? String(community.admin.userId) : null;
  return memberIds.includes(String(userId)) || adminId === String(userId);
};

const ClientCommunity = ({ initialCommunity }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [community, setCommunity] = useState(initialCommunity);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [error, setError] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [joining, setJoining] = useState(false);
  const messageEndRef = useRef(null);

  const currentUser = useMemo(() => {
    if (user && user._id) return user;
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, [user]);

  const communityId = community?._id;
  const userId = currentUser?._id;
  const member = isCommunityMember(community, userId);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!communityId) return;
      setLoadingMessages(true);
      setError("");

      try {
        const response = await api.get(`/api/community-messages/${communityId}`);
        setMessages(Array.isArray(response.data?.messages) ? response.data.messages : []);
      } catch (err) {
        console.error("Error loading chat history:", err);
        setError(
          err?.response?.data?.message ||
            "Could not load chat history. You may need to join the community."
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [communityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !communityId) return;

    const onConnect = () => {
      setSocketStatus("Connected");
      if (member) {
        socket.emit(
          "join-community",
          { communityId },
          (response) => {
            if (response?.success) {
              setRoomJoined(true);
              setError("");
            } else {
              setRoomJoined(false);
              setError(response?.message || "Unable to join chat room");
            }
          }
        );
      }
    };

    const onDisconnect = () => {
      setSocketStatus("Disconnected");
      setRoomJoined(false);
    };

    const onConnectError = (err) => {
      setSocketStatus("Connection error");
      setError(err?.message || "Socket connection failed.");
    };

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("receive-message", onReceiveMessage);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("receive-message", onReceiveMessage);
      if (communityId) {
        socket.emit("leave-community", { communityId });
      }
    };
  }, [communityId, member]);

  const handleJoin = async () => {
    if (!communityId) return;
    if (!currentUser?._id) {
      router.push("/Login");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await api.post("/api/join-community", { communityId });
      if (response.data?.success) {
        const updated = response.data.community;
        setCommunity(updated);
        setError("");
        const socket = getSocket();
        if (socket && updated?._id) {
          socket.emit("join-community", { communityId: updated._id }, (res) => {
            if (res?.success) {
              setRoomJoined(true);
            } else {
              setRoomJoined(false);
              setError(res?.message || "Could not join chat room after joining community.");
            }
          });
        }
      }
    } catch (err) {
      console.error("Error joining community:", err);
      setError(err?.response?.data?.message || "Failed to join community.");
    } finally {
      setJoining(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !communityId) return;
    if (!roomJoined) {
      setError("Join the community first to send messages.");
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    const payload = { communityId, message: newMessage.trim() };
    socket.emit("send-message", payload, (response) => {
      if (!response?.success) {
        setError(response?.message || "Message send failed.");
      }
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#050505]">

  {/* CHAT BODY */}
  <div className="flex-1 overflow-hidden px-3 sm:px-5 lg:px-6 py-4">

    {/* ERROR */}
    {error && (
      <div
        className="
        mb-4 rounded-2xl
        border border-red-500/15
        bg-red-500/10
        px-4 py-3
        text-sm text-red-200
        "
      >
        {error}
      </div>
    )}

    {/* NOT MEMBER */}
    {!member ? (

      <div
        className="
        flex h-full
        items-center justify-center
        "
      >
        <div
          className="
          w-full max-w-lg
          rounded-[30px]
          border border-white/10
          bg-[#0B0B0B]
          px-8 py-12
          text-center
          "
        >

          <div
            className="
            mx-auto mb-6
            flex h-16 w-16
            items-center justify-center
            rounded-2xl
            border border-white/10
            bg-white/[0.03]
            "
          >
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>

          <h3
            className="
            text-2xl font-semibold
            tracking-tight text-white
            "
          >
            Join Community Chat
          </h3>

          <p
            className="
            mx-auto mt-3
            max-w-md
            text-sm leading-relaxed
            text-white/45
            "
          >
            Become a member to participate in live
            discussions, share thoughts, and interact
            with the community in real time.
          </p>

          <button
            onClick={handleJoin}
            disabled={joining}
            className="
            mt-8
            rounded-2xl
            bg-white
            px-6 py-3
            text-sm font-medium
            text-black
            transition-all duration-300
            hover:opacity-90
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            {joining
              ? "Joining..."
              : "Join Community"}
          </button>
        </div>
      </div>

    ) : (

      <div
        className="
        flex h-full flex-col
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-[#090909]
        "
      >

        {/* MESSAGES */}
        <div
          className="
          flex-1 overflow-y-auto
          px-3 sm:px-5
          py-5
          "
        >

          {loadingMessages ? (

            <div
              className="
              flex h-full
              items-center justify-center
              "
            >
              <div className="text-sm text-white/45">
                Loading messages...
              </div>
            </div>

          ) : messages.length === 0 ? (

            <div
              className="
              flex h-full
              flex-col items-center justify-center
              text-center
              "
            >

              <div
                className="
                mb-5
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                "
              >
                <div className="h-3 w-3 rounded-full bg-white/40" />
              </div>

              <h3 className="text-lg font-medium text-white/80">
                No Messages Yet
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Start the first conversation in this community.
              </p>
            </div>

          ) : (

            <div className="mx-auto max-w-5xl space-y-5">

              {messages.map((message, index) => {

                const isOwnMessage =
                  message.user === user?._id;

                return (
                  <div
                    key={
                      message._id ||
                      `${message.username}-${message.createdAt}`
                    }
                    className={`flex ${
                      isOwnMessage
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`
                      flex max-w-[88%] gap-3 sm:max-w-[75%]
                      ${
                        isOwnMessage
                          ? "flex-row-reverse"
                          : ""
                      }
                      `}
                    >

                      {/* AVATAR */}
                      <div
                        className="
                        h-10 w-10
                        shrink-0 overflow-hidden
                        rounded-full
                        border border-white/10
                        "
                      >
                        <img
                          src={
                            message.avatar ||
                            "/avatar1.jpg"
                          }
                          alt={
                            message.username
                              ? `${message.username} avatar`
                              : "User avatar"
                          }
                          className="
                          h-full w-full object-cover
                          "
                        />
                      </div>

                      {/* MESSAGE */}
                      <div
                        className={`
                        rounded-[24px]
                        border px-4 py-3
                        ${
                          isOwnMessage
                            ? `
                              border-white
                              bg-white
                              text-black
                            `
                            : `
                              border-white/10
                              bg-[#111111]
                              text-white
                            `
                        }
                        `}
                      >

                        {/* TOP */}
                        <div
                          className="
                          mb-2 flex items-center
                          gap-2
                          "
                        >

                          <p
                            className={`
                            text-sm font-medium
                            ${
                              isOwnMessage
                                ? "text-black/80"
                                : "text-white/75"
                            }
                            `}
                          >
                            {message.username || "Anonymous"}
                          </p>

                          <span
                            className={`
                            text-[11px]
                            ${
                              isOwnMessage
                                ? "text-black/45"
                                : "text-white/30"
                            }
                            `}
                          >
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* TEXT */}
                        <p
                          className="
                          whitespace-pre-wrap
                          break-words
                          text-sm leading-relaxed
                          "
                        >
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messageEndRef} />
            </div>
          )}
        </div>

        {/* INPUT */}
        <div
          className="
          border-t border-white/10
          bg-[#080808]
          px-3 sm:px-5
          py-4
          "
        >

          <form
            onSubmit={sendMessage}
            className="mx-auto max-w-5xl"
          >

            <div
              className="
              flex items-end gap-3
              rounded-[26px]
              border border-white/10
              bg-[#111111]
              px-4 py-3
              "
            >

              <input
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(e.target.value)
                }
                placeholder="Write something to the community..."
                className="
                flex-1
                bg-transparent
                text-sm text-white
                outline-none
                placeholder:text-white/30
                "
              />

              <button
                type="submit"
                disabled={
                  !roomJoined ||
                  !newMessage.trim()
                }
                className="
                rounded-2xl
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-black
                transition-all duration-300
                hover:opacity-90
                disabled:opacity-40
                disabled:cursor-not-allowed
                "
              >
                Send
              </button>
            </div>

            <p
              className="
              mt-3 text-center
              text-[11px]
              text-white/25
              "
            >
              Be respectful and keep conversations meaningful.
            </p>
          </form>
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default ClientCommunity;
