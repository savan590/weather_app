const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  city: String,
  date: String,
  tempSum: Number,
  maxTemp: Number,
  minTemp: Number,
  count: Number,
  dominantCondition: String,
});

WeatherSchema.virtual('averageTemp').get(function () {
  return (this.tempSum / this.count).toFixed(2);
});

module.exports = mongoose.model('Weather', WeatherSchema);
