const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./user/user_controller');
app.use('/user', UserController);

module.exports = app;
