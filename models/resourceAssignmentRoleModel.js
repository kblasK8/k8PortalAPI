'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RarSchema = new Schema({
  name: {
    type: String,
    required: "Provide Resource Assignment Role Name.",
    index: true,
    unique: true,
    dropDups: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResourceAssignmentRole', RarSchema);
