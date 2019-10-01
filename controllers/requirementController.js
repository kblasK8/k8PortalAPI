'use strict';

var mongoose = require('mongoose');

Requirement = mongoose.model('Requirement');

exports.list_all_requirements = function(req, res) {
  Requirement.find({}, function(err, requirement) {
    if(err)
      res.send(err);
    res.json(requirement);
  });
};

exports.create_a_requirement = function(req, res) {
  var new_requirement = new Requirement(req.body);
  new_requirement.save(function(err, requirement) {
    if(err)
      res.send(err);
    res.json(requirement);
  });
};

exports.read_a_requirement = function(req, res) {
  Requirement.find({ parent_project_id: req.params.requirementId}, function(err, requirement) {
    if(err)
      res.send(err);
    res.json(requirement);
  });
};

exports.update_a_requirement = function(req, res) {
  Requirement.findOneAndUpdate({_id: req.params.requirementId}, req.body, {new: true}, function(err, requirement){
    if(err)
      res.send(err);
    res.json(requirement);
  });
};

exports.delete_a_requirement = function(req, res) {
  Requirement.remove({ _id: req.params.requirementId}, function(err, requirement) {
    if(err)
      res.send(err);
    res.json({message: 'Requirement successfully deleted.'});
  });
};
