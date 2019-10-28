'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: "Provide Project Id."
  },
  name: {
    type: String,
    required: "Provide Task Name."
  },
  priority: {
    type: [{
      type: String,
      enum: ['Low', 'Medium', 'High']
    }],
    default: ['Medium']
  },
  plan_start_date: {
    type: Date,
    required: "Provide Project Start Date."
  },
  plan_end_date: {
    type: Date,
    required: "Provide Project End Date."
  },
  actual_start_date: {
    type: Date,
    required: "Provide Project Actual Start Date."
  },
  actual_end_date: {
    type: Date,
    required: "Provide Project Actual End Date."
  },
  status: {
    type: [{
      type: String,
      enum: ['Pending', 'On-Going', 'Review', 'Done', 'QA', 'UAT', 'Closed']
    }],
    default: ['Pending']
  },
  resource: {
    type:[{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
      },
      name: {
        first_name: String,
        last_name: String
      }
    }]
  },
  jira: {
    type: String
  },
  jira_url: {
    type: String
  },
  remarks: {
    type: String
  },
  year: {
    type: String,
    required: "Provide Scope Year."
  },
  quarter: {
    type: [{
      type: String,
      enum: ['1st', '2nd', '3rd', '4th']
    }],
    required: "Provide Quarter Scope."
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);