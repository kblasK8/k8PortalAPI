'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  first_name: {
    type: String,
    required: "Provide Account First Name."
  },
  last_name: {
    type: String,
    required: "Provide Account Last Name."
  },
  full_name: {
    type: String,
    required: "Provide Account Full Name."
  },
  job_role: {
    type: String,
    required: "Provide Job Role."
  },
  department: {
    type: String,
    required: "Provide Department Name."
  },
  email: {
    type: String,
    required: "Provide Email Address."
  },
  password: {
    type: String,
    required: "Provide Account Password."
  },
  shift: {
    type: [{
      type: String,
      enum: ['GY', 'MID']
    }],
  },
  type: {
    type: [{
      type: String,
      enum: ['Admin', 'HR', 'Team Lead', 'Manager', 'User']
    }],
  },
  status: {
    type: [{
      type: String,
      enum: ['Enabled', 'Disabled']
    }],
    default: ['Enabled']
  },
  profilePhoto: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Account', AccountSchema);
