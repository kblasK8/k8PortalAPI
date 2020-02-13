'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShiftSchema = new Schema({
  name: {
    type: String,
    required: "Provide Shift name.",
    index: true,
    unique: true,
    dropDups: true
  },
  start_time: {
    type: String,
    required: "Provide Start time."
  },
  end_time: {
    type: String,
    required: "Provide End time."
  },
  day_offs: {
    type: [Number],
    required: "Provide day offs."
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date
  }
});

module.exports = mongoose.model('Shift', ShiftSchema);
