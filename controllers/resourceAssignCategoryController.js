'use strict';

var mongoose = require('mongoose');

RecAssignCat = mongoose.model('ResourceAssignmentCategory');

exports.list_all_rac = function(req, res) {
  RecAssignCat.find({}, function(err, rac) {
    if(err)
      res.send(err);
    res.json(rac);
  });
};

exports.create_a_rac = function(req, res) {
  var new_rac = new RecAssignCat(req.body);
  new_rac.save(function(err, rac) {
    if(err)
      res.send(err);
    res.json(rac);
  });
};

exports.read_a_rac = function(req, res) {
  RecAssignCat.findById(req.params.racId, function(err, rac) {
    if(err)
      res.send(err);
    res.json(rac);
  });
};

exports.update_a_rac = function(req, res) {
  RecAssignCat.findOneAndUpdate({_id: req.params.racId}, req.body, {new: true}, function(err, rac){
    if(err)
      res.send(err);
    res.json(rac);
  });
};

exports.delete_a_rac = function(req, res) {
  RecAssignCat.remove({ _id: req.params.racId}, function(err, rac) {
    if(err)
      res.send(err);
    res.json({message: 'Resource Assignment Category successfully deleted.'});
  });
};
