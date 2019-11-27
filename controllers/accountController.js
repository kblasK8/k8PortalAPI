var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
// const tokenCheck = require('../middleware/tokenCheck');
const Account = require('../models/accountModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const secretKey = "K8PortalAPI";

exports.login_account = function(req, res) {
  var email = req.body.email;
  var password = SHA256(req.body.password).toString(CryptoJS.enc.Hex);
  Account.findOne(
    {
      "email" : email,
      "password" : password
    },
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      if(!account) {
        res
        .status(401)
        .json({
          statusCode: 401,
          error: true,
          msg: "Invalid credentials."
        });
        return;
      } else {
        const user = {
          _id : account._id,
          first_name : account.first_name,
          middle_name : account.middle_name,
          last_name : account.last_name,
          email : account.email
        };
        jwt.sign(
          user,
          secretKey,
          { expiresIn: "7 days" },
          (err, token) => {
            if(err) { res.send(err); }
            res.json({ token });
          }
        );
      }
    }
  );
}

exports.list_all_accounts = function(req, res) {
  Account.find(
    { status: 'Enabled' },
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.list_all_account_by_department = function(req, res) {
  var department = req.params.department;
  var query = [];
  if(department && department.indexOf(',') > -1) {
    var departmentArr = department.split(',');
    departmentArr.forEach(element => {
      query.push({ "department" : element });
    });
  } else {
    query = [ 
      { "department" : department }
    ];
  }
  Account.find(
    {
      $and : [
        { status: 'Enabled' },
        { $or: query }
      ]
    },
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.list_all_account_by_type = function(req, res) {
  var type = req.params.type;
  var query = [];
  if(type && type.indexOf(',') > -1) {
    var typeArr = type.split(',');
    typeArr.forEach(element => {
      query.push({ "type" : element });
    });
  } else {
    query = [ 
      { "type" : type }
    ];
  }
  Account.find(
    {
      $and : [
        { status: 'Enabled' },
        { $or: query }
      ]
    },
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
} 

exports.filter_account = function(req, res) {
  Account.find(
    req.body,
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.create_a_account = function(req, res) {
  var new_account = new Account(req.body);
  if(req.body.password) {
    req.body.password = SHA256(req.body.password).toString(CryptoJS.enc.Hex);
  }
  new_account.save(function(err, account) {
    if(err) { res.send(err); }
    delete account.password;
    res.json(account);
  });
};

exports.read_a_account = function(req, res) {
  Account.findById(
    req.params.accountId,
    { "password" : 0, "__v": 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.update_a_account = function(req, res) {
  Account.findById(req.params.accountId, function(err, account) {
    if(err) { res.send(err); }
    if(req.file) { req.body.profilePhoto = req.file.path; }
    if(req.body.password) {
      req.body.password = SHA256(req.body.password).toString(CryptoJS.enc.Hex);
    }
    Account.findOneAndUpdate(
      { _id: req.params.accountId },
      req.body,
      {
        "fields" : {
          "password" : 0,
          "__v": 0
        },
        new : true
      },
      function(e, acc) {
        if(e) { res.send(e); }
        if(req.file) {
          if(fs.existsSync(account.profilePhoto)) {
            unlinkAsync(account.profilePhoto);
          }
        }
        res.json(acc);
      }
    );
  });
};

exports.delete_a_account = function(req, res) {
  Account.deleteOne({ _id: req.params.accountId}, function(err, account) {
    if(err) { res.send(err); }
    res.json({ message: 'Account successfully deleted.' });
  });
};
