const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const auth = require('../user/auth');
const User = require('../user/user');
const Atm = require('./atm');
const travel = require('./travel');

/// Returns a list of atms sorted by user preference.
/// An atm contains a name, distance and approximated travel distance and time
/// using the users preferred method of transport.
router.get('/', auth.verifyToken, (req, res) => {
  const lat = parseFloat(req.query.lat);
  const long = parseFloat(req.query.long);
  const radius = parseFloat(req.query.radius);
  if (isNaN(lat) || isNaN(long) || isNaN(radius)) {
    return res.status(400).send({
      auth: true,
      message: 'Requires lat long and radius parameters',
    });
  }
  const user_position = {lat, long};
  const search_parameters = travel.squareSearchParameters({
    position: user_position,
    radius,
  });
  Atm.find({
   lat: { $gt: search_parameters.lat_min, $lt: search_parameters.lat_max },
   long: { $gt: search_parameters.long_min, $lt: search_parameters.long_max },
  }, (err, atms) => {
    if (err) {
      return res.status(500).send({
        auth: true,
        message: 'Could not get atms',
      });
    }
    User.findById(req.userId, (err, user) => {
      if (err) {
        return res.status(500).send({
          auth: true,
          message: 'Could not get user preferences',
        });
      }
      const sorted_atms = travel.sortAtmsByPreferences({
        atms,
        transport: user.prefered_transport,
        max_travel_time: user.maximum_traveltime_in_seconds,
        user_position,
      });
      res.status(200).send({
        auth: true,
        atms: sorted_atms,
      });
    });
  });
});

module.exports = router;
