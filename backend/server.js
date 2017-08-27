const express = require('express');

const app = express();

app.use('/', require('./webpackRouter'));

app.listen(3000);
