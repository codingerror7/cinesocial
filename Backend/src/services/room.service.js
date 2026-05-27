import Community from '../model/Community.models.js';

export const isMemberOfCommunity = async (communityId, userId) => {
  const community = await Community.findById(communityId).select('members admin');
  if (!community) return false;
  const isMember = community.members.some((m) => m.toString() === userId.toString()) || community.admin?.userId?.toString() === userId.toString();
  return isMember;
};

export const addOnlineMember = async (communityId, user) => {
  try {
    await Community.findByIdAndUpdate(communityId, { $addToSet: { onlineMembers: user._id }, $set: { lastActivity: new Date() } });
  } catch (err) {
    console.warn('addOnlineMember failed', err.message || err);
  }
};

export const removeOnlineMember = async (communityId, userId) => {
  try {
    await Community.findByIdAndUpdate(communityId, { $pull: { onlineMembers: userId } });
  } catch (err) {
    console.warn('removeOnlineMember failed', err.message || err);
  }
};
