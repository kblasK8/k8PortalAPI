'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
  name: {
    type: String,
    required: "Provide Department Name.",
    index: true,
    unique: true,
    dropDups: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', DepartmentSchema);
