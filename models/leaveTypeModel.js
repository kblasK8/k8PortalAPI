'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeaveTypeSchema = new Schema({
  name: {
    type: String,
    required: "Kindly enter a leave type name.",
    index: true,
    unique: true,
    dropDups: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
