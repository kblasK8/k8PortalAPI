var SHA256 = require("crypto-js/sha256");
var mongoose = require('mongoose');
const Account = require('../models/accountModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.list_all_accounts = function(req, res) {
  Account.find(
    {},
    { password : 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.list_all_nu_accounts = function(req, res) {
  Account.find(
    { type: { $ne : 'User' } },
    { password : 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.list_all_account_by_type = function(req, res) {
  Account.find(
    { department: req.params.dept },
    { password : 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.list_all_account_in_dev_dept = function(req, res) {
  Account.find({ 
    $and : [
      {
        status: 'Enabled'
      },
      {
        $or: [ 
          { department: 'Development' }, 
          { department: 'Quality Assurance' },
        ] 
      }
    ]
  },
  { password : 0 },
  function(err, account) {
    if(err) { res.send(err); }
    res.json(account);
  });
};

exports.filter_account = function(req, res) {
  Account.find(
    req.body,
    { password : 0 },
    function(err, account) {
      if(err) { res.send(err); }
      res.json(account);
    }
  );
};

exports.create_a_account = function(req, res) {
  var new_account = new Account(req.body);
  if(req.body.password) { req.body.password = SHA256(req.body.password); }
  new_account.save(function(err, account) {
    if(err) { res.send(err); }
    delete account.password;
    res.json(account);
  });
};

exports.read_a_account = function(req, res) {
  Account.findById(
    req.params.accountId,
    { password : 0 },
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
    if(req.body.password) { req.body.password = SHA256(req.body.password); }
    Account.findOneAndUpdate(
      { _id: req.params.accountId },
      req.body,
      {
        "fields" : { "password" : 0 },
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
  Account.remove({ _id: req.params.accountId}, function(err, account) {
    if(err) { res.send(err); }
    res.json({ message: 'Account successfully deleted.' });
  });
};
