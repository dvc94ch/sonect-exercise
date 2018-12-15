const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./user/user_controller');
app.use('/user', UserController);

const AtmController = require('./atm/atm_controller');
app.use('/atm', AtmController);

module.exports = app;
