'use strict';

var mongoose = require('mongoose');

SubProj = mongoose.model('SubProject');

exports.list_all_sub_projs = function(req, res) {
  SubProj.find({}, function(err, sub_proj) {
    if(err)
      res.send(err);
    res.json(sub_proj);
  });
};

exports.create_a_sub_proj = function(req, res) {
  var new_sub_proj = new SubProj(req.body);
  new_sub_proj.save(function(err, sub_proj) {
    if(err)
      res.send(err);
    res.json(sub_proj);
  });
};

exports.read_a_sub_proj = function(req, res) {
  SubProj.find({ parent_project: req.params.subProjId}, function(err, sub_proj) {
    if(err)
      res.send(err);
    res.json(sub_proj);
  });
};

exports.filter_sub_proj = function(req, res) {
  SubProj.find(req.body, function(err, task) {
    if(err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_sub_proj = function(req, res) {
  SubProj.findOneAndUpdate({_id: req.params.subProjId}, req.body, {new: true}, function(err, sub_proj){
    if(err)
      res.send(err);
    res.json(sub_proj);
  });
};

exports.delete_a_sub_proj = function(req, res) {
  SubProj.remove({ _id: req.params.subProjId}, function(err, sub_proj) {
    if(err)
      res.send(err);
    res.json({message: 'Sub Project successfully deleted.'});
  });
};
