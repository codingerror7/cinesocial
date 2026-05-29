import Community from "../model/Community.models.js";

export const isMemberOfCommunity = async (communityId, userId) => {
  if (!communityId || !userId) return false;

  const community = await Community.findOne({
    _id: communityId,
    $or: [
      { members: userId },
      { "admin.userId": userId },
    ],
  }).lean();

  return !!community;
};

export const addMemberToCommunity = async (communityId, userId) => {
  if (!communityId || !userId) return null;

  const community = await Community.findById(communityId);
  if (!community) return null;

  const isAlreadyMember = community.members.some((member) => String(member) === String(userId))
    || String(community.admin?.userId) === String(userId);

  if (isAlreadyMember) {
    return community;
  }

  community.members.push(userId);
  community.membersCount = Math.max(community.membersCount + 1, community.members.length);
  await community.save();

  return community;
};
