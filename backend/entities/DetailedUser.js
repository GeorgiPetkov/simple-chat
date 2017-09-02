const User = require('./User');

module.exports = class DetailedUser extends User {
  constructor({ id, username, role, chats, notifications, friendsList }) {
    super(id, username, role);
    this._chatIds = chats;
    this._notifications = notifications.map(notification => ({
      type: notification.notificationType,
      isRead: notification.isRead
    }));
    this._friendsList = friendsList.map(friend => ({
      id: friend.id,
      username: friend.username,
      friendshipStatus: friend.friendshipStatus
    }));
  }

  get chatIds() {
    return this._chatIds;
  }

  get notifications() {
    return this._notifications;
  }

  get friendsList() {
    return this._friendsList;
  }
};
