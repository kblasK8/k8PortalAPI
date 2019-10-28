'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {
    type: String,
    required: "Provide Project A Name."
  },
  status: {
    type: [{
      type: String,
      enum: ['Pending', 'On-Going', 'Closed', 'Done']
    }],
    default: ['Pending']
  },
  department: {
    type: String,
    required: "Provide Department Name."
  },
  description: {
    type: String,
  },
  client: {
    type: String
  },
  owner: {
    type: String
  },
  lead: {
    type: String
  },
  mid_lead: {
    type: String
  },
  gy_lead: {
    type: String
  },
  progress: {
    type: Number
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
