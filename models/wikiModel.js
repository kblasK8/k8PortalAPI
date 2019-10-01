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
    type: {
        name: String,
    },
  },
  contributors: {
    type: [{
        name: String,
        created_date: Date,
    }],
  },
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
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Wiki', WikiSchema);
