const HttpStatus = require('http-status-codes');

module.exports = {
  BodyParser: require('body-parser').json(),
  Session: require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'the-secret-that-can-never-be-told'
  }),
  LoggedUsersOnly: (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      next();
    }
  }
};
