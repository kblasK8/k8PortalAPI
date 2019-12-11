const moment = require('moment');
const mongoose = require('mongoose');
const Requirement = require('../models/requirementsModel');
const config = require('../config/config');
const fs = require('fs');

exports.list_all_requirements = (req, res) => {
  Requirement.find()
  .select('-__v')
  .exec(
    (err, requirement) => {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.list_all_project_requirements = (req, res) => {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  var query = { project_id : req.params.projectId };
  Requirement.find(query)
  .limit(perPage)
  .skip(perPage * (pageNo - 1))
  .sort({
    name : 'asc'
  })
  .select('-__v')
  .exec(
    (err, data) => {
      if(err) { res.send(err); }
      Requirement.estimatedDocumentCount(query).exec(
        (err, count) => {
          if(err) { res.send(err); }
          var response = {
            data : data,
            page : pageNo,
            pages : Math.ceil(count / perPage)
          };
          res.json(response);
        }
      );
    }
  );
};

exports.list_all_project_requirements_type = (req, res) => {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  var query = { project_id: req.params.projectId, type: req.params.type };
  Requirement.find(query)
  .limit(perPage)
  .skip(perPage * (pageNo - 1))
  .sort({
    name : 'asc'
  })
  .select('-__v')
  .exec(
    (err, data) => {
      if(err) { res.send(err); }
      Requirement.estimatedDocumentCount(query).exec(
        (err, count) => {
          if(err) { res.send(err); }
          var response = {
            data : data,
            page : pageNo,
            pages : Math.ceil(count / perPage)
          };
          res.json(response);
        }
      );
    }
  );
};

exports.create_a_requirement = (req, res) => {
  var new_requirement = new Requirement(req.body);
  new_requirement.save(
    (err, requirement) => {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.read_a_requirement = (req, res) => {
  Requirement.find(
    { _id : req.params.requirementId }
  )
  .select('-__v')
  .exec(
    (err, requirement) => {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.update_a_requirement = (req, res) => {
  req.body.updated_date = new moment().format();
  Requirement.findOneAndUpdate(
    { _id : req.params.requirementId },
    req.body,
    {
      "fields" : { "__v": 0 },
      new : true
    }
  )
  .exec(
    (err, requirement) => {
      if(err) { res.send(err); }
      res.json(requirement);
    }
  );
};

exports.delete_a_requirement = (req, res) => {
  Requirement.remove(
    { _id : req.params.requirementId },
    (err, requirement) => {
      if(err) { res.send(err); }
      res.json({ message : 'Requirement successfully deleted.' });
    }
  );
};

// ------------------------------------------------------------------------------------------------------

exports.newfolder = (req, res) => {
  var path = req.body.path;
  var folderName = req.body.folderName;
  if(
    typeof path === "undefined" ||
    typeof folderName === "undefined"
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Path and folder are required."
    });
    return;
  }
  var dirPath = path + '/' + folderName;
  fs.mkdir(
    config.uploadPath + dirPath,
    { recursive : true },
    (err, cb) => {
      if(err) { res.send(err); }
      res.json({ message : "Directory created" });
    }
  );
};
