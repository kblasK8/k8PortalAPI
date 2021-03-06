'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourceAssignmentSchema = new Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: "Provide Project Id."
  },
  resources: [
    {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: "Provide Account Id."
      },
      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResourceAssignmentRole',
        required: "Provide ResourceAssignmentRole Id."
      }
    }
  ],
  date_updated: {
    type: Date
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResourceAssignment', ResourceAssignmentSchema);
