'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssetSchema = new Schema({
  tagging_number: {
    type: String,
    required: "Provide Tagging Number."
  },
  serial_number: {
    type: String,
    required: "Provide Serial Number."
  },
  product: {
    type: String
  },
  brand: {
    type: String
  },
  date_received: {
    type: Date
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Provide Account Id."
  },
  ip_address: {
    type: String
  },
  comodo: {
    type: Boolean
  },
  updated_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Asset', AssetSchema);