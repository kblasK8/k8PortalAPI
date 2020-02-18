'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeaveMasterSchema = new Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: "Provide Account Id."
  },
  leaves: [{
    leave_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      unique: true,
      dropDups: true,
      ref: 'LeaveType',
      required: "Kindly enter a leave type."
    },
    total_count: {
      type: Number,
      required: "Kindly enter a total count."
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number
    },
    created_date: {
      type: Date,
      default: Date.now
    },
    updated_date: {
      type: Date
    }
  }]
});

module.exports = mongoose.model('LeaveMaster', LeaveMasterSchema);
