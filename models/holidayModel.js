'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HolidaySchema = new Schema({
  name: {
    type: String,
    required: "Provide holiday name.",
    index: true,
    unique: true,
    dropDups: true
  },
  holiday_date: {
    type: String,
    required: "Provide holiday date.",
    index: true,
    unique: true,
    dropDups: true
  },
  type: {
    type: [String],
    enum: ['Regular', 'Special non-working']
  },
  country: {
    type: [String],
    enum: ['PH', 'US']
  },
  year: {
    type: String
  },
  updated_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Holiday', HolidaySchema);
