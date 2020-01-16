'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RacSchema = new Schema({
  name: {
    type: String,
    required: "Provide Resource Assignment Category Name.",
    index: true,
    unique: true,
    dropDups: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResourceAssignmentCategory', RacSchema);
