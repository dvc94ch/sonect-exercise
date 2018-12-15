const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(400).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        message: 'Failed to authenticate token.',
      });
    }

    req.userId = decoded.id;
    next();
  });
};

const createToken = (user) => {
  return jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
};

module.exports = {
  verifyToken,
  createToken,
};
