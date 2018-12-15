/// The Earth radius in meters
const EARTH_RADIUS = 6371e3;

/// Convert degrees to radians
const toRadians = (degree) => {
  return degree / 180 * Math.PI;
};

/// Convert radians to degrees
const toDegrees = (radians) => {
  return radians / Math.PI * 180;
};

/// Distance between two coordinates using the equirectangular approximation.
const distance = (position1, position2) => {
  const lat_delta = toRadians(position2.lat - position1.lat);
  const long_delta = toRadians(position2.long - position1.long);
  const lat = toRadians(position1.lat);

  const long_corrected = Math.cos(lat) * long_delta;
  const c = Math.sqrt(lat_delta * lat_delta + long_corrected * long_corrected);

  return EARTH_RADIUS * c;
};

/// Distance between two coordinates using the haversine method.
const distance_haversine = (position1, position2) => {
  const lat1 = toRadians(position1.lat);
  const lat2 = toRadians(position2.lat);
  const lat_delta = toRadians(position2.lat - position1.lat);
  const long_delta = toRadians(position2.long - position1.long);

  const sin_lat = Math.sin(lat_delta / 2);
  const sin_long = Math.sin(long_delta / 2);

  const a = sin_lat * sin_lat +
        Math.cos(lat1) * Math.cos(lat2) * sin_long * sin_long;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
};

/// To quickly filter db entries we compute the bounding square
/// of the search area.
const squareSearchParameters = ({position, radius}) => {
  const lat_delta = toDegrees(radius / EARTH_RADIUS / 2);
  const long_correction = Math.cos(toRadians(position.lat));
  const long_delta = toDegrees(radius / EARTH_RADIUS / long_correction / 2);

  return {
    lat_max: position.lat + lat_delta,
    lat_min: position.lat - lat_delta,
    long_max: position.long + long_delta,
    long_min: position.long - long_delta,
  };
};

/// The distance to travel in a city can be approximated as the
/// manhattan distance.
const estimateTravelDistance = (position1, position2) => {
  return distance(position1, {lat: position2.lat, long: position1.long}) +
    distance(position1, {lat: position1.lat, long: position2.long});
};

/// The travel speed is estimated based on the transportation method.
const estimateTravelSpeed = (transport) => {
  switch (transport) {
  case 'car':
    // 50 km/h
    return 13.5;
  case 'foot':
    return 1.4;
  default:
    return 13.5;
  }
};

const estimateTravelTime = (transport, position1, position2) => {
  return estimateTravelDistance(position1, position2) /
    estimateTravelSpeed(transport);
};

/// We drop atms further than away than max_travel_time using transport from the
/// user_position. Returns a list of atms sorted by travel time.
const sortAtmsByPreferences = ({atms, transport, max_travel_time, user_position}) => {
  const sorted_atms = [];
  for (let i = 0; i < atms.length; i++) {
    const atm_position = { lat: atms[i].lat, long: atms[i].long };
    const travel_time = estimateTravelTime(transport, user_position, atm_position);
    if (travel_time <= max_travel_time) {
      sorted_atms.push({
        name: atms[i].name,
        distance: distance(user_position, atm_position),
        travel_time,
      });
    }
  }
  sorted_atms.sort((atm1, atm2) => atm1.travel_time - atm2.travel_time);
  return sorted_atms;
};

module.exports = {
  squareSearchParameters,
  sortAtmsByPreferences,
};
