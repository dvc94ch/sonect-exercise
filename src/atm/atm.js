const mongoose = require('mongoose');

const AtmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
});
mongoose.model('Atm', AtmSchema);

module.exports = mongoose.model('Atm');
