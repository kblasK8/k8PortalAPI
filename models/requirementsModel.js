'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequirementsSchema = new Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: "Provide Project Id."
  },
  description: {
    type: String,
    required: "Kindly enter a description."
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  type: {
    type: [{
      type: String,
      enum: ['BR', 'GR', 'TR']
    }],
    required: "Kindly enter name of Type."
  },
  updated_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Requirement', RequirementsSchema);
