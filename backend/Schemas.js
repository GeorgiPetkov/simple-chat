const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: require('./common/Role').All
  },
  isBanned: Boolean,
  chats: [{
    type: ObjectId,
    required: true
  }],
  notifications: [{
    notificationType: {
      type: String,
      required: true,
      enum: require('./common/NotificationType').All
    },
    isRead: {
      type: Boolean,
      required: true
    },
    content: Mixed
  }],
  friendsList: [{
    id: {
      type: ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    friendshipStatus: {
      type: String,
      required: true,
      enum: require('./common/FriendshipStatus').All
    }
  }]
});
UserSchema.pre('save', function(next) {
  const user = this;
  console.log(user);
  bcrypt.hash(user.password, 10)
    .then(hashedPassword => {
      user.password = hashedPassword;
      next();
    })
    .catch(next);
});

const ChatSchema = new Schema({
  participants: [{
    type: ObjectId,
    required: true
  }],
  messages: [{
    userId: {
      type: ObjectId,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }]
});

module.exports = {
  UserSchema: UserSchema,
  ChatSchema: ChatSchema
};
