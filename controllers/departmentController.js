const mongoose = require('mongoose');
const Department = require('../models/departmentModel');
const Account = require('../models/accountModel');
const Project = require('../models/projectModel');
const Wiki = require('../models/wikiModel');
var getDeptName = (departmentId, res) => {
  return new Promise((resolve, reject) => {
    Department.findById(
      departmentId,
      { "__v": 0 },
      (err, department) => {
        if(err) { res.send(err); }
        resolve(department.name);
      }
    );
  });
}
var countUseAccount = (deptName, res) => {
  return new Promise((resolve, reject) => {
    Account.countDocuments(
      { department : deptName },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}
var countUseProject = (deptName, res) => {
  return new Promise((resolve, reject) => {
    Project.countDocuments(
      { department : deptName },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}
var countUseWiki = (deptName, res) => {
  return new Promise((resolve, reject) => {
    Wiki.countDocuments(
      { department : deptName },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}

exports.list_all_departments = (req, res) => {
  Department.find(
    {},
    { "__v": 0 },
    (err, departments) => {
      if(err) { res.send(err); }
      res.json(departments);
    }
  );
}

exports.create_a_department = (req, res) => {
  var new_department = new Department(req.body);
  new_department.save(
    (err, department) => {
      if(err) {
        res.send(err);
        return;
      }
      var obj = department.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_department = (req, res) => {
  Department.findById(
    req.params.departmentId,
    { "__v": 0 },
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
}

exports.update_a_department = (req, res) => {
  Department.findOneAndUpdate(
    { _id: req.params.departmentId },
    req.body,
    {
      "fields" : { "__v": 0 },
      new : true
    },
    (err, department) => {
      if(err) { res.send(err); }
      res.json(department);
    }
  );
}

exports.delete_a_department = (req, res) => {
  (async () => {
    var deptName = await getDeptName(req.params.departmentId, res);
    var countAccount = await countUseAccount(deptName, res);
    var countProject = await countUseProject(deptName, res);
    var countWiki = await countUseWiki(deptName, res);
    var usedIn = "";
    var bln = true;
    if(countAccount) {
      bln = false;
      usedIn += "Account, ";
    }
    if(countProject) {
      bln = false;
      usedIn += "Project, ";
    }
    if(countWiki) {
      bln = false;
      usedIn += "Wiki, ";
    }
    if(bln) {
      Department.remove(
        { _id: req.params.departmentId },
        (err, department) => {
          if(err) { res.send(err); }
          res.json({ message: 'Department successfully deleted.' });
        }
      );
    } else {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "Department name currently used in [" + usedIn.slice(0, -2) + "]"
      });
      return;
    }
  })();
}
