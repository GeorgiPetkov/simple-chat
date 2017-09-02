const NotificationType = {
  SystemMessage: 'system_message',
  FriendRequestAccepted: 'friend_request_accepted',
  FriendRequestRejected: 'friend_request_rejected'
};

module.exports = {
  SystemMessage: NotificationType.SystemMessage,
  FriendRequestAccepted: NotificationType.FriendRequestAccepted,
  FriendRequestRejected: NotificationType.FriendRequestRejected,
  ALL: [NotificationType.SystemMessage, NotificationType.FriendRequestAccepted, NotificationType.FriendRequestRejected]
};
