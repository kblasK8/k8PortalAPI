var mongoose = require('mongoose');
const Project = require('../models/projectModel');

exports.list_all_projects = function(req, res) {
  Project.find({})
  .populate('project_category')
  .exec(function(err, project) {
    if(err) { res.send(err); }
    res.json(project);
  });
};

exports.create_a_project = function(req, res) {
  var new_project = new Project(req.body);
  new_project.save(function(err, project) {
    if(err) { res.send(err); }
    Project.findById(project._id)
    .populate('project_category')
    .exec(function(err, project) {
      if(err) { res.send(err); }
      res.json(project);
    });
  });
};

exports.read_a_project = function(req, res) {
  Project.find({ department: req.params.projectId })
  .populate('project_category')
  .exec(function(err, project) {
    if(err) { res.send(err); }
    res.json(project);
  });
};

exports.filter_a_project = function(req, res) {
  var params = req.body;
  var pageNo = parseInt(params.pageNo);
  var perPage = parseInt(params.perPage);
  delete params.pageNo;
  delete params.perPage;
  var query = {};
  Object.keys(params).forEach(function(key) {
    var reg = new RegExp(params[key], 'i');
    query[key] = reg;
  });
  Project.find(query)
    .limit(perPage)
    .skip(perPage * (pageNo - 1))
    .sort({
      name: 'asc'
    })
    .populate('project_category')
    .exec(function(err, data) {
      if(err) { res.send(err); }
      Project.estimatedDocumentCount(query).exec(function(err, count) {
        if(err) { res.send(err); }
        var response = {
          data: data,
          page: pageNo,
          pages: Math.ceil(count / perPage)
        };
        res.json(response);
      });
    });
};

exports.update_a_project = function(req, res) {
  Project.findOneAndUpdate(
    { _id: req.params.projectId },
    req.body, { new: true },
    function(err, project) {
      if(err) { res.send(err); }
      Project.findById(project._id)
      .populate('project_category')
      .exec(function(err, project) {
        if(err) { res.send(err); }
        res.json(project);
      });
  });
};

exports.delete_a_project = function(req, res) {
  Project.remove({ _id: req.params.projectId }, function(err, project) {
    if(err)
      res.send(err);
    res.json({message: 'Project successfully deleted.'});
  });
};

exports.page = function(req, res) {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  Project.find()
    .limit(perPage)
    .skip(perPage * (pageNo - 1))
    .sort({
      name: 'asc'
    })
    .populate('project_category')
    .exec(function(err, data) {
      if(err) { res.send(err); }
      Project.estimatedDocumentCount().exec(function(err, count) {
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
