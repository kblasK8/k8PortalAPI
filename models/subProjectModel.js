'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubProjectSchema = new Schema({
  parent_project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: "Provide Project Id."
  },
  name: {
    type: String,
    required: "Kindly enter a sub project name."
  },
  modules: {
    type: String,
  },
  status: {
    type: [{
      type: String,
      enum: ['Pending', 'On-Going', 'Closed', 'Done']
    }],
    default: ['Pending']
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('SubProject', SubProjectSchema);
