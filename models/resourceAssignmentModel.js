'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourceAssignmentSchema = new Schema({
  parent_project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: "Provide Project Id."
  },
  parent_project_name: {
    type: String,
    required: "Provide Resource Assignment Category."
  },
  parent_project_status: {
    type: [{
        type: String,
        enum: ['Pending', 'On-Going', 'Closed', 'Done']
      }],
    default: ['Pending']
  },
  ra_category: {
    type: String,
    required: "Provide Resource Assignment Category."
  },
  ra_role: {
    type: String,
    required: "Provide Resource Assignment Role."
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Provide Resource Account Id."
  },
  shift: {
    type: [{
      type: String,
      enum: ['GY', 'MID']
    }],
  },
  full_name: {
    type: String,
    required: "Provide Account Full Name."
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResourceAssignment', ResourceAssignmentSchema);
