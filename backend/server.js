const express = require('express');
const enableWs = require('express-ws');

const app = express();
enableWs(app);

app.use(require('./webpackRouter'));

const middlewares = require('./middlewares');
app.use(middlewares.BodyParser);
app.use(middlewares.Session);

app.use(require('./authorizationRouter')); // login, register, logout

app.use('/api', middlewares.LoggedUsersOnly);

app.use('/api', require('./restRouter'));

app.ws('/api/notifications');

app.listen(3000);
