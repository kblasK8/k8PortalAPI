const mongoose = require('mongoose');
const Department = require('../models/departmentModel');

exports.list_all_departments = (req, res) => {
  Department.find(
    {},
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
};

exports.create_a_department = (req, res) => {
  var new_department = new Department(req.body);
  new_department.save(
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
};

exports.read_a_department = (req, res) => {
  Department.findById(
    req.params.departmentId,
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
};

exports.update_a_department = (req, res) => {
  Department.findOneAndUpdate(
    { _id: req.params.departmentId },
    req.body,
    { new : true },
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
};

exports.delete_a_department = (req, res) => {
  Department.remove(
    { _id: req.params.departmentId },
    (err, department) => {
      if(err) { res.send(err); }
      res.json({ message: 'department successfully deleted.' });
    }
  );
};
