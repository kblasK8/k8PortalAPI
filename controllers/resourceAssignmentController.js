var mongoose = require('mongoose');
var moment = require('moment');
const ResourceAssignment = require('../models/resourceAssignmentModel');

exports.list_all_ra = function(req, res) {
  ResourceAssignment.find()
  .populate('project_id')
  .populate('project_category')
  .populate('resources.account_id')
  .populate('resources.role')
  .exec(function(err, ra) {
    if(err) { res.send(err); }
    res.json(ra);
  });
};

exports.filter_ra = function(req, res) {
  ResourceAssignment.find(req.body, function(err, ra) {
    if(err) { res.send(err); }
    res.json(ra);
  });
};

exports.create_a_ra = function(req, res) {
  var new_ra = new ResourceAssignment(req.body);
  new_ra.save(function(err, ra) {
    if(err) { res.send(err); }
    ResourceAssignment.findById(ra._id)
    .populate('project_id')
    .populate('project_category')
    .populate('resources.account_id')
    .populate('resources.role')
    .exec(function(err, ra) {
      if(err) { res.send(err); }
      res.json(ra);
    });
  });
};

exports.read_a_ra = function(req, res) {
  ResourceAssignment.findById(req.params.raId, function(err, ra) {
    if(err) { res.send(err); }
    res.json(ra);
  });
};

exports.update_a_ra = function(req, res) {
  req.body.updated_date = new moment().format();
  ResourceAssignment.findOneAndUpdate(
    { _id: req.params.raId },
    req.body,
    { new: true },
    function(err, ra) {
      if(err) { res.send(err); }
      res.json(ra);
    }
  );
};

exports.delete_a_ra = function(req, res) {
  ResourceAssignment.remove({ _id: req.params.raId}, function(err, ra) {
    if(err) { res.send(err); }
    res.json({message: 'Resource assignment successfully deleted.'});
  });
};
