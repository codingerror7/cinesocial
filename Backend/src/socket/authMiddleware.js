import jwt from 'jsonwebtoken';
import User from '../model/User.models.js';

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication token missing'));
    const secret = process.env.ACCESS_SECRET;
    if (!secret) return next(new Error('Server missing ACCESS_SECRET'));
    const payload = jwt.verify(token, secret);
    if (!payload?.userId) return next(new Error('Invalid token payload'));
    const user = await User.findById(payload.userId).select('_id name avatar');
    if (!user) return next(new Error('User not found'));
    socket.user = { _id: user._id.toString(), name: user.name, avatar: user.avatar };
    return next();
  } catch (err) {
    console.error('Socket auth failed', err.message || err);
    return next(new Error('Authentication failed'));
  }
};
