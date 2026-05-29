import jwt from "jsonwebtoken";
import User from "../model/User.models.js";

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    if (!decoded?.userId) {
      return next(new Error("Invalid token payload"));
    }

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = {
      _id: String(user._id),
      username: user.name || user.userName || 'Anonymous',
      avatar: user.avatar || '',
      userId: String(user._id),
    };

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};
