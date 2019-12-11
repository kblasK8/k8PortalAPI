'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var idpSchema = new Schema({
  userId: {
    type: String,
    required: "Kindly enter a user ID."
  },
  name: {
    type: String,
    required: "Kindly enter a name."
  },
  idp_date: {
    type: Date,
    required: "Kindly enter a date."
  },
  job_summary: {
    type: String,
    required: "Kindly enter a job summary."
  },
  achievement: {
    type: String,
    required: "Kindly enter enter a achievement."
  },
  strength_soft_skills: {
    type: String,
    required: "Kindly enter a soft skill."
  },
  strength_technical: {
    type: String,
    required: "Kindly enter a technical value."
  },
  development_soft_skills: {
    type: String,
    required: "Kindly enter a development soft skill."
  },
  development_technical: {
    type: String,
    required: "Kindly enter a technical development value."
  },
  short_term: {
    type: String,
    required: "Kindly enter a value."
  },
  medium_term: {
    type: String,
    required: "Kindly enter a value."
  },
  long_term: {
    type: String,
    required: "Kindly enter a value."
  },
  date_signed_emp: {
    type: String,
    required: "Kindly enter a date employee signed."
  },
  date_signed_mng: {
    type: String,
    required: "Kindly enter a date manager signed."
  },
  development_plans: {
    type: Array
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('idp', idpSchema);
