var mongoose = require('mongoose');
const RecAssignRole = require('../models/resourceAssignmentRoleModel');

exports.list_all_rar = function(req, res) {
  RecAssignRole.find({}, function(err, rac) {
    if(err) { res.send(err); }
    res.json(rac);
  });
};

exports.create_a_rar = function(req, res) {
  var new_rar = new RecAssignRole(req.body);
  new_rar.save(function(err, rac) {
    if(err) { res.send(err); }
    res.json(rac);
  });
};

exports.read_a_rar = function(req, res) {
  RecAssignRole.findById(req.params.rarId, function(err, rac) {
    if(err) { res.send(err); }
    res.json(rac);
  });
};

exports.update_a_rar = function(req, res) {
  RecAssignRole.findOneAndUpdate(
    { _id: req.params.rarId },
    req.body,
    { new: true },
    function(err, rac) {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
};

exports.delete_a_rar = function(req, res) {
  RecAssignRole.remove(
    { _id: req.params.rarId },
    function(err, rac) {
      if(err) { res.send(err); }
      res.json({ message: 'Resource Assignment Role successfully deleted.' });
    }
  );
};
