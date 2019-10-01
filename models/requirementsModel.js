'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequirementsSchema = new Schema({
  parent_project_id: {
    type: String,
  },
  // parent_project_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Project',
  //   required: "Provide Project Id."
  // },
  // sub_project_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Project',
  //   required: "Provide Sub Project Id."
  // },
  description: {
    type: String,
    required: "Kindly enter a description."
  },
  url: {
    type: String,
    required: "Kindly enter a URL."
  },
  author: {
    type: String,
    required: "Kindly enter name of author."
  },
  type: {
    type: [{
      type: String,
      enum: ['BR', 'GR', 'TR']
    }],
    required: "Kindly enter name of Type."
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Requirement', RequirementsSchema);
