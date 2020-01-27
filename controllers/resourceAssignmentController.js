const mongoose = require('mongoose');
const moment = require('moment');
const ResourceAssignment = require('../models/resourceAssignmentModel');

exports.list_all_ra = (req, res) => {
  ResourceAssignment.find()
  .select('-__v')
  .populate('resources.account_id')
  .populate('resources.role', 'name')
  .exec(
    (err, ras) => {
      if(err) { res.send(err); }
      res.json(ras);
    }
  );
}

exports.filter_ra = (req, res) => {
  var custom_fields = null;
  var custom_populate = null;
  if(req.body.custom_fields) {
    custom_fields = req.body.custom_fields;
    delete req.body.custom_fields;
  }
  if(req.body.custom_populate) {
    custom_populate = req.body.custom_populate;
    delete req.body.custom_populate;
  }
  ResourceAssignment.find(req.body)
  .select('-__v')
  .populate('resources.account_id', custom_fields)
  .populate('resources.role', '_id name')
  .exec(
    (err, ras) => {
      if(err) { res.send(err); }
      if(
        custom_populate !== null &&
        custom_populate.toLowerCase() === "true"
      ) {
        var data_arr = [];
        var data_val = {};
        var resources_temp = [];
        ras.forEach(
          (value, index) => {
            data_val._id = value._id;
            data_val.project_id = value.project_id;
            var resources = value.resources;
            if(resources) {
              resources.forEach(
                (v, i) => {
                  var resource_obj = {}
                  resource_obj._id = v._id;
                  if(v.role) {
                    resource_obj.role_id = v.role._id;
                    resource_obj.role = v.role.name;
                  }
                  var account_info = {}
                  account_info = JSON.stringify(v.account_id);
                  account_info = JSON.parse(account_info);
                  for(var property in account_info) {
                    if(property == "_id") {
                      resource_obj.account_id = account_info[property];
                    } else {
                      resource_obj[property] = account_info[property];
                    }
                  }
                  resources_temp.push(resource_obj);
                }
              );
            }//if
            data_val.resources = resources_temp;
            data_arr.push(data_val);
          }
        );
        res.json(data_arr);
      } else {
        res.json(ras);
      }
    }
  );
}

exports.create_a_ra = (req, res) => {
  var new_ra = new ResourceAssignment(req.body);
  new_ra.save(
    (err, ra) => {
      if(err) { res.send(err); }
      ResourceAssignment.findById(ra._id)
      .select('-__v')
      .populate('resources.account_id')
      .populate('resources.role', 'name')
      .exec(
        (err, ra) => {
          if(err) { res.send(err); }
          res.json(ra);
        }
      );
    }
  );
}

exports.read_a_ra = (req, res) => {
  ResourceAssignment.findById(req.params.raId)
  .select('-__v')
  .populate('resources.account_id')
  .populate('resources.role', 'name')
  .exec(
    (err, ra) => {
      if(err) { res.send(err); }
      res.json(ra);
    }
  );
}

exports.update_a_ra = (req, res) => {
  req.body.updated_date = new moment().format();
  ResourceAssignment.findOneAndUpdate(
    { _id: req.params.raId },
    req.body,
    { 
      "fields" : { "__v" : 0 },
      new : true
    },
    (err, ra) => {
      if(err) { res.send(err); }
      res.json(ra);
    }
  );
}

exports.delete_a_ra = (req, res) => {
  ResourceAssignment.remove(
    { _id: req.params.raId },
    (err, ra) => {
      if(err) { res.send(err); }
      res.json({ message: 'Resource assignment successfully deleted.' });
    }
  );
}
