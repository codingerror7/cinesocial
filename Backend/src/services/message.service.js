import Message from '../model/Message.model.js';
import mongoose from 'mongoose';

export const createMessage = async ({ communityId, userId, username, avatar, message }) => {
  const msg = await Message.create({ community: communityId, sender: userId, username, avatar: avatar || '', message });
  return msg;
};

export const getMessages = async ({ communityId, beforeId, limit = 30 }) => {
  const query = { community: communityId };
  if (beforeId && mongoose.isValidObjectId(beforeId)) {
    const before = await Message.findById(beforeId).select('_id createdAt');
    if (before) query.createdAt = { $lt: before.createdAt };
  }
  const messages = await Message.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  return messages.reverse(); // return oldest -> newest
};

export const markRead = async ({ communityId, userId }) => {
  await Message.updateMany(
    { community: communityId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );
};
