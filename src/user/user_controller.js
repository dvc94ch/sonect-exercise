const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('./user');

/// Creates a new user
router.post('/', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }, (err, user) => {
    if (err) {
      return res.status(500).send('Could not create user.');
    }
    res.status(200).send(user);
  });
});

/// Returns all the users in the database
router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).send('Could not query users.');
    }
    res.status(200).send(users);
  });
});

/// Gets a single user from the database
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send('Could not get user');
    }
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    return res.status(200).send(user);
  });
});

/// Deletes a user from the database
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send('Could not delete user');
    }
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    res.status(200).send('User ' + user.name + ' was deleted.');
  });
});

/// Updates a user in the database
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (err) {
      return res.status(500).send('Could not update user');
    }
    res.status(200).send(user);
  });
});

module.exports = router;
