const express = require('express');
const HttpStatus = require('http-status-codes');

const Role = require('./common/Role');
const repository = require('./repository');

// the returned promise is never rejected, instead it handles the error
function ensureHavingRole(req, res, role) {
  return new Promise((resolve) => (req.session.user.role === role) ?
    resolve() : res.status(HttpStatus.FORBIDDEN).end);
}

function createUserDto({ id, username, role, isBanned }) {
  return { id, username, role, isBanned };
}

function createDetailedUserDto({ id, username, role, isBanned, chatIds, notifications, friendsList }) {
  return {
    id,
    username,
    role,
    isBanned,
    chatIds,
    notifications,
    friendsList: friendsList.map(friend => ({
      id: friend.id,
      username: friend.username,
      friendshipStatus: friend.friendshipStatus
    }))
  };
}

module.exports = express.Router()
  .use('/users', express.Router()
    .get((req, res) => {
      ensureHavingRole(req, res, Role.Admin)
        .then(() => repository.getUsers())
        .then(users => res.json(users.map(createUserDto)))
        .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
    })
    .post((req, res) => {
      const { username, password, role } = req.body;

      if (!/^[_a-z0-9]{8,}$/.test(username) || (password || 0).length < 8) {
        res.status(HttpStatus.BAD_REQUEST).end();

        return;
      }

      ensureHavingRole(req, res, Role.Admin)
        .then(() => repository.isUsernameAlreadyTaken(username))
        .then(isTaken => {
          if (isTaken) {
            res.status(HttpStatus.BAD_REQUEST).end();

            return;
          }

          repository.createUser(username, password, role)
            .then(createdUser => res.status(HttpStatus.CREATED).json(createUserDto(createdUser)))
            .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
        });
    })
    .use('/:userId', express.Router({ mergeParams: true })
      .get((req, res) => {
        const userId = req.params.userId;

        if (req.session.user.id !== userId) {
          res.status(HttpStatus.FORBIDDEN).end();

          return;
        }

        ensureHavingRole(req, res, Role.Standard)
          .then(() => repository.getDetailedUser(userId))
          .then(user => res.json(createDetailedUserDto(user)));
      })
      .delete((req, res) => {
        ensureHavingRole(req, res, Role.Admin)
          .then(() => repository.deleteUser(req.params.userId))
          .then(() => res.end())
          .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
      })
      .use('/friends-list/:friendId', express.Router({ mergeParams: true })
        .post((req, res) => {
          const userId = req.params.userId;

          if (req.session.user.id !== userId) {
            res.status(HttpStatus.FORBIDDEN).end();

            return;
          }

          ensureHavingRole(req, res, Role.Standard)
            .then(() => repository.getDetailedUser(req.params.friendId))
            .then(friendUser => {
              if (friendUser === null) {
                return undefined;
              }

              if (friendUser.friendsList.find(friend => friend.id === userId) !== undefined) {
                return repository.confirmFriendship(userId, friendUser);
              }

              return repository.addFriend(userId, friendUser);
            })
            .then(() => res.end())
            .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
        })
        .delete((req, res) => {
          const userId = req.params.userId;

          if (req.session.user.id !== userId) {
            res.status(HttpStatus.FORBIDDEN).end();

            return;
          }

          ensureHavingRole(req, res, Role.Standard)
            .then(() => repository.getDetailedUser(userId))
            .then(user => {
              const friendId = req.params.friendId;

              if (user.friendsList.find(friend => friend.id === friendId) !== undefined) {
                return repository.removeFriend(userId, friendId);
              }

              return repository.rejectFriendship(userId, friendId);
            })
            .then(() => res.end())
            .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
        }))));
