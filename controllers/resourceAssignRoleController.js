const mongoose = require('mongoose');
const RecAssignRole = require('../models/resourceAssignmentRoleModel');

exports.list_all_rar = (req, res) => {
  RecAssignRole.find(
    {},
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
};

exports.create_a_rar = (req, res) => {
  var new_rar = new RecAssignRole(req.body);
  new_rar.save(
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
};

exports.read_a_rar = (req, res) => {
  RecAssignRole.findById(
    req.params.rarId,
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
};

exports.update_a_rar = (req, res) => {
  RecAssignRole.findOneAndUpdate(
    { _id: req.params.rarId },
    req.body,
    { new: true },
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
};

exports.delete_a_rar = (req, res) => {
  RecAssignRole.remove(
    { _id: req.params.rarId },
    (err, rac) => {
      if(err) { res.send(err); }
      res.json({ message: 'Resource Assignment Role successfully deleted.' });
    }
  );
};
