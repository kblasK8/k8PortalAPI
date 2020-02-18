'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeaveRequestSchema = new Schema({
  leave_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: "Kindly enter a leave type."
  },
  total_count: {
    type: Number
  },
  paid_count: {
    type: Number
  },
  unpaid_count: {
    type: Number
  },
  start_date: {
    type: Date,
    required: "Kindly enter start date."
  },
  end_date: {
    type: Date,
    required: "Kindly enter end date."
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
    type: [String],
    required: "Kindly enter a status.",
    enum: ['Pending', 'Approved', 'Rejected'],
    default: ['Pending']
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date
  }
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
