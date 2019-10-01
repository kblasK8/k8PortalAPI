'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  name: {
    type: String,
    required: "Kindly enter the note name."
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['Development','Creative','Business Development', 'others']
    }],
    default: ['Development']
  }
});

module.exports = mongoose.model('Note', NoteSchema);
