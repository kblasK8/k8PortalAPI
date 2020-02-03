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
  approver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Kindly enter an approver id."
  },
  requestor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Kindly enter a requestor id."
  },
  status: {
    type: String,
    required: "Kindly enter a status."
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
