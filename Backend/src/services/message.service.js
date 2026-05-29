import Message from "../model/Message.model.js";

export const createMessage = async ({ communityId, userId, username, avatar, message }) => {
  const saved = await Message.create({
    community: communityId,
    sender: userId,
    username: username || 'Anonymous',
    avatar: avatar || '',
    message: String(message).trim(),
  });

  return {
    _id: saved._id,
    communityId: saved.community,
    sender: saved.sender,
    username: saved.username,
    avatar: saved.avatar,
    message: saved.message,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
  };
};

export const getMessagesByCommunity = async (communityId, limit = 100) => {
  const messages = await Message.find({ community: communityId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();

  return messages.map((message) => ({
    ...message,
    communityId: message.community,
  }));
};
