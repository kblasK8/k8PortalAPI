'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WikiSchema = new Schema({
  title: {
    type: String,
    required: "Kindly enter a title."
  },
  department: {
    type: String,
    required: "Kindly enter a department."
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Provide author Account Id."
  },
  contributors: [{
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: "Provide contributor Account Id."
    },
    updated_date: {
      type: Date
    },
  }],
  type: {
    type: String
  },
  content: {
    type: String
  },
  parentWiki: {
    type: String
  },
  tags: {
    type: Array
  },
  images: {
    type: Array
  },
  updated_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Wiki', WikiSchema);
