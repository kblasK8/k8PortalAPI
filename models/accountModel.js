'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  first_name: {
    type: String,
    required: "Provide Account First Name."
  },
  middle_name: {
    type: String
  },
  last_name: {
    type: String,
    required: "Provide Account Last Name."
  },
  suffix_name: {
    type: String
  },
  job_role: {
    type: String
  },
  department: {
    type: String
  },
  email: {
    type: String,
    required: "Provide Email Address."
  },
  password: {
    type: String,
    required: "Provide Account Password."
  },
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: "Provide a Shift ID."
  },
  type: {
    type: [String],
    enum: ['Admin', 'HR', 'Team Lead', 'Manager', 'User']
  },
  status: {
    type: [String],
    enum: ['Enabled', 'Disabled'],
    default: ['Enabled']
  },
  profilePhoto: {
    type: String,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Account', AccountSchema);
