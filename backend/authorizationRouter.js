const express = require('express');
const HttpStatus = require('http-status-codes');
const repository = require('./repository');
const Role = require('./common/Role');

function proceedWithUser(req, res, user) {
  if (user.isBanned) {
    res.status(HttpStatus.FORBIDDEN).end();

    return;
  }

  req.session.user = {
    userId: user.id,
    username: user.username,
    role: user.role
  };
  res.json(req.session.user);
}

module.exports = express.Router()
  .get('/login', (req, res) => {
    if (req.session.user === undefined) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      res.json(req.session.user);
    }
  })
  .post('/login', (req, res) => {
    const user = req.body;

    if (!user.username || !user.password) {
      res.status(HttpStatus.BAD_REQUEST).end();

      return;
    }

    repository.getAuthenticatedUser(user.username, user.password)
      .then(authenticatedUser => proceedWithUser(req, res, authenticatedUser))
      .catch(() => res.status(HttpStatus.UNAUTHORIZED).end());
  })
  .post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!/^[_a-z0-9]{8,}$/.test(username) || (password || '').length < 8) {
      res.status(HttpStatus.BAD_REQUEST).end();

      return;
    }

    repository.isUsernameAlreadyTaken(username)
      .then(isTaken => {
        if (isTaken) {
          res.status(HttpStatus.BAD_REQUEST).end();

          return;
        }

        repository.createUser(username, password, Role.Standard)
          .then(createdUser => proceedWithUser(req, res, createdUser))
          .catch(() => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
      });
  })
  .delete('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/static/index.html');
  });
