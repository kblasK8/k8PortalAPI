const mongoose = require('mongoose');
const RecAssignRole = require('../models/resourceAssignmentRoleModel');

exports.list_all_rar = (req, res) => {
  RecAssignRole.find()
  .select('-__v')
  .exec(
    (err, rar) => {
      if(err) { res.send(err); }
      res.json(rar);
    }
  );
};

exports.create_a_rar = (req, res) => {
  var new_rar = new RecAssignRole(req.body);
  new_rar.save(
    (err, rar) => {
      if(err) { res.send(err); }
      var obj = rar.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
};

exports.read_a_rar = (req, res) => {
  RecAssignRole.findById(
    req.params.rarId,
    (err, rar) => {
      if(err) { res.send(err); }
      var obj = rar.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
};

exports.update_a_rar = (req, res) => {
  RecAssignRole.findOneAndUpdate(
    { _id: req.params.rarId },
    req.body,
    { 
      "fields" : { "__v" : 0 },
      new : true
    },
    (err, rar) => {
      if(err) { res.send(err); }
      res.json(rar);
    }
  );
};

exports.delete_a_rar = (req, res) => {
  RecAssignRole.remove(
    { _id: req.params.rarId },
    (err, rar) => {
      if(err) { res.send(err); }
      res.json({ message: 'Resource Assignment Role successfully deleted.' });
    }
  );
};
