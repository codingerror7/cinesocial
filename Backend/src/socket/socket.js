
import { Server } from "socket.io";
import { socketAuth } from "./authMiddleware.js";
import { createMessage } from "../services/message.service.js";
import { isMemberOfCommunity } from "../services/room.service.js";

export const initSocket = (server, clientOrigin) => {
    const allowedOrigins = Array.isArray(clientOrigin)
        ? clientOrigin
        : String(clientOrigin).split(",").map(origin => origin.trim()).filter(Boolean);

    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error(`Socket CORS origin denied: ${origin}`));
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // socket authentication
    io.use(async (socket, next) => {

        try {

            await socketAuth(socket, next);

        } catch (error) {

            next(new Error("Authentication failed"));

        }

    });

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);

        // JOIN COMMUNITY ROOM
        socket.on("join-community", async ({ communityId }, callback) => {

            try {

                if (!communityId) {
                    return callback?.({
                        success: false,
                        message: "Community id required"
                    });
                }

                // verify membership
                const isMember = await isMemberOfCommunity(
                    communityId,
                    socket.user._id
                );

                if (!isMember) {

                    return callback?.({
                        success: false,
                        message: "You must join community first"
                    });

                }

                const roomName = `community_${communityId}`;

                socket.join(roomName);

                console.log(
                    `User ${socket.user._id} joined ${roomName}`
                );

                callback?.({
                    success: true
                });

            } catch (error) {

                console.error("Join room error:", error.message);

                callback?.({
                    success: false,
                    message: "Unable to join room"
                });

            }

        });

        // LEAVE COMMUNITY ROOM
        socket.on("leave-community", ({ communityId }) => {

            const roomName = `community_${communityId}`;

            socket.leave(roomName);

            console.log(
                `User ${socket.user._id} left ${roomName}`
            );

        });

        // SEND MESSAGE
        socket.on("send-message", async (payload, callback) => {

            try {

                const { communityId, message } = payload;

                if (!communityId || !message) {

                    return callback?.({
                        success: false,
                        message: "Invalid payload"
                    });

                }

                // verify membership
                const isMember = await isMemberOfCommunity(
                    communityId,
                    socket.user._id
                );

                if (!isMember) {

                    return callback?.({
                        success: false,
                        message: "Not a community member"
                    });

                }

                // save message in database
                const savedMessage = await createMessage({

                    communityId,

                    userId: socket.user._id,

                    username: socket.user.username,

                    avatar: socket.user.avatar,

                    message

                });

                const roomName = `community_${communityId}`;

                // broadcast message to room
                io.to(roomName).emit(
                    "receive-message",
                    savedMessage
                );

                callback?.({
                    success: true
                });

            } catch (error) {

                console.error(
                    "Send message error:",
                    error.message
                );

                callback?.({
                    success: false,
                    message: "Unable to send message"
                });

            }

        });

        // DISCONNECT
        socket.on("disconnect", () => {

            console.log("Socket disconnected:", socket.id);

        });

    });

    return io;

};

