const FriendshipStatus = {
  Pending: 'pending',
  Accepted: 'accepted',
  Rejected: 'rejected'
};

module.exports = {
  Pending: FriendshipStatus.Pending,
  Accepted: FriendshipStatus.Accepted,
  Rejected: FriendshipStatus.Rejected,
  ALL: [FriendshipStatus.Pending, FriendshipStatus.Accepted, FriendshipStatus.Rejected]
};
