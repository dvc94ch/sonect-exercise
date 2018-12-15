const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const bcrypt = require('bcryptjs');
const auth = require('./auth');

const User = require('./user');

/// Creates a new user
router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  }, (err, user) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Could not create user',
      });
    }
    res.status(200).send({
      auth: true,
      token: auth.createToken(user),
    });
  });
});

/// Get user data
router.get('/me', auth.verifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: 'Could not get user',
        });
      }
      if (!user) {
        return res.status(404).send({
          auth: false,
          message: 'User not found',
        });
      }
      return res.status(200).send(user);
    });
});

/// Login user
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Could not login',
      });
    }
    if (!user) {
      return res.status(404).send({
        auth: false,
        message: 'User not found',
      });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        token: null,
      });
    }

    res.status(200).send({
      auth: true,
      token: auth.createToken(user),
    });
  });
});

/// Logout user
router.post('/logout', (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
