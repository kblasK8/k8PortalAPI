'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WikiSchema = new Schema({
  title: {
    type: String,
  },
  department: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  contributors: [{
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
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
