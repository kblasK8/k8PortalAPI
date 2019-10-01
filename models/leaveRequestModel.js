'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeaveRequestSchema = new Schema({
  type: {
    type: String,
    required: "Kindly enter a type."
  },
  start_date: {
    type: {
        name: Date,
    },
    required: "Kindly enter start date."
  },
  end_date: {
    type: {
        name: Date,
    },
    required: "Kindly enter end date."
  },
  time_off: {
    type: {
        name: String,
    },
    required: "Kindly enter a time off."
  },
  remarks: {
    type: String,
    required: "Kindly enter a remarks."
  },
  approver: {
    type: Object,
    required: "Kindly enter an approver."
  },
  approver_id: {
    type: String,
    required: "Kindly enter an approver id."
  },
  requestor: {
    type: String,
    required: "Kindly enter a requestor."
  },
  requestor_id: {
    type: String,
    required: "Kindly enter a requestor id."
  },
  status: {
    type: String,
    required: "Kindly enter a status."
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
