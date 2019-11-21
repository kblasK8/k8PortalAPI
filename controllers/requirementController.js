var moment = require('moment');
var mongoose = require('mongoose');
const Requirement = require('../models/requirementsModel');

exports.list_all_requirements = function(req, res) {
  Requirement.find({})
    .select('-__v')
    .exec(function(err, requirement) {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.list_all_project_requirements = function(req, res) {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  var query = { project_id: req.params.projectId };
  Requirement.find(query)
    .limit(perPage)
    .skip(perPage * (pageNo - 1))
    .sort({
      name: 'asc'
    })
    .select('-__v')
    .exec(function(err, data) {
      if(err) { res.send(err); }
      Requirement.estimatedDocumentCount(query).exec(function(err, count) {
        if(err) { res.send(err); }
        var response = {
          data: data,
          page: pageNo,
          pages: Math.ceil(count / perPage)
        };
        res.json(response);
      });
    }
  );
};

exports.list_all_project_requirements_type = function(req, res) {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  var query = { project_id: req.params.projectId, type: req.params.type };
  Requirement.find(query)
    .limit(perPage)
    .skip(perPage * (pageNo - 1))
    .sort({
      name: 'asc'
    })
    .select('-__v')
    .exec(function(err, data) {
      if(err) { res.send(err); }
      Requirement.estimatedDocumentCount(query).exec(function(err, count) {
        if(err) { res.send(err); }
        var response = {
          data: data,
          page: pageNo,
          pages: Math.ceil(count / perPage)
        };
        res.json(response);
      });
    }
  );
};

exports.create_a_requirement = function(req, res) {
  var new_requirement = new Requirement(req.body);
  new_requirement.save(function(err, requirement) {
    if(err) { res.send(err); }
    res.json(requirement);
  });
};

exports.read_a_requirement = function(req, res) {
  Requirement.find({ _id : req.params.requirementId })
    .select('-__v')
    .exec(function(err, requirement) {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.update_a_requirement = function(req, res) {
  req.body.updated_date = new moment().format();
  Requirement.findOneAndUpdate(
    { _id: req.params.requirementId },
    req.body,
    {
      "fields": { "__v": 0 },
      new : true
    }
  )
  .exec(function(err, requirement) {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.delete_a_requirement = function(req, res) {
  Requirement.remove(
    { _id: req.params.requirementId },
    function(err, requirement) {
      if(err) { res.send(err); }
      res.json({ message: 'Requirement successfully deleted.' });
    }
  );
};
