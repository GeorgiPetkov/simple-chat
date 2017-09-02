const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/SimpleChat', {
  useMongoClient: true
});

const FriendshipStatus = require('./common/FriendshipStatus');

const User = require('./entities/User');
const DetailedUser = require('./entities/DetailedUser');
const Chat = require('./entities/Chat');

const Schemas = require('./Schemas');
const Users = mongoose.model('User', Schemas.UserSchema);
const Chats = mongoose.model('Chat', Schemas.ChatSchema);

class Repository {
  isUsernameAlreadyTaken(username) {
    return Users.count({ username: username })
      .then(count => count !== 0)
      .catch(console.log);
  }

  getUsers() {
    return Users.find({}, 'id username role isBanned').exec()
      .then(users => users.map(user => new User(user)));
  }

  getDetailedUser(id) {
    return Users.findOne({ id: id }).exec()
      .then(user => user === null ? null : new DetailedUser(user));
  }

  getAuthenticatedUser(username, password) {
    return Users.findOne({ username: username }, 'id username role password').exec()
      .then(user => {
        if (user === null) {
          throw new Error(`User '$username' not found.`);
        }

        return bcrypt.compare(password, user.password)
          .then(isPasswordCorrect => {
            if (isPasswordCorrect) {
              return new User(user);
            }

            throw new Error('Invalid password.');
          });
      });
  }

  createUser(username, password, role) {
    return Users.create({
        username: username,
        password: password,
        role: role,
        isBanned: false,
        chats: [],
        notifications: [],
        friendsList: []
      })
      .then(user => new User(user))
      .catch(console.log);
  }

  deleteUser(id) {
    return Chats.find({ participants: id }, 'participants')
      .then(chats => [].concat.apply([], chats.map(chat => chat.participants)))
      .then(participants => Users.update({
        id: {
          $in: participants
        }
      }, {
        $pull: {
          chats: {
            id: id
          }
        }
      }))
      .then(() => Chats.remove({
        participants: id
      }))
      .then(() => Users.update({
        friendsList: {
          id: id
        }
      }, {
        $pull: {
          friendsList: {
            id: id
          }
        }
      }))
      .then(() => Users.findOneAndRemove({
        id: id
      }));
  }

  getChat(id) {
    return Chats.findOne({
      id: id
    }).then(chat => chat === null ? null : new Chat(chat));
  }

  createChat(participants) {
    return Chats.create({
      participants: participants,
      messages: []
    });
  }

  deleteChat(id) {
    return Chats.findOneAndRemove({ id: id })
      .then(chat => chat === null ?
        Promise.resolve() : Users.update({
          id: {
            $in: chat.participants
          }
        }), {
          $pull: {
            chats: {
              id: id
            }
          }
        });
  }

  confirmFriendship(userId, friendUser) {
    return Promise.all(
      Users.update({
        id: friendUser.id,
        'friendsList.id': userId
      }, {
        $set: {
          'friendsList.$.friendshipStatus': FriendshipStatus.Accepted
        }
      }),
      Users.update({
        id: userId
      }, {
        $push: {
          friendsList: {
            id: friendUser.id,
            username: friendUser.username,
            friendshipStatus: FriendshipStatus.Accepted
          }
        }
      }));
  }

  addFriend(userId, friendUser) {
    return Users.update({
      id: userId
    }, {
      $push: {
        friendsList: {
          id: friendUser.id,
          username: friendUser.username,
          friendshipStatus: FriendshipStatus.Pending
        }
      }
    });
  }

  removeFriend(userId, friendId) {
    Promise.all(
      Users.update({
        id: userId
      }, {
        $pull: {
          friendsList: {
            id: friendId
          }
        }
      }),
      Users.update({
        id: friendId,
        'friendsList.id': userId
      }, {
        $set: {
          'friendsList.$.friendshipStatus': FriendshipStatus.Rejected
        }
      }));
  }

  rejectFriendship(userId, friendId) {
    return Users.update({
      id: friendId,
      'friendsList.id': userId
    }, {
      $set: {
        'friendsList.$.friendshipStatus': FriendshipStatus.Rejected
      }
    });
  }
}

module.exports = new Repository();
