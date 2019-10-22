var mongoose = require('mongoose');
const Account = require('../models/accountModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.list_all_accounts = function(req, res) {
  Account.find({}, function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.list_all_nu_accounts = function(req, res) {
  Account.find({type: {$ne : 'User'}}, function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.list_all_account_by_type = function(req, res) {
  Account.find({department: req.params.dept}, function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.list_all_account_in_dev_dept = function(req, res) {
  Account.find( 
      { 
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
      function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.filter_account = function(req, res) {
  Account.find(req.body, function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.create_a_account = function(req, res) {
  var new_account = new Account(req.body);
  new_account.save(function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.read_a_account = function(req, res) {
  Account.findById(req.params.accountId, function(err, account) {
    if(err)
      res.send(err);
    res.json(account);
  });
};

exports.update_a_account = function(req, res) {
  Account.findById(req.params.accountId, function(err, account) {
    if(err) res.send(err);
    if(req.file) req.body.profilePhoto = req.file.path;
    Account.findOneAndUpdate(
      { _id: req.params.accountId },
      req.body,
      { new : true },
      function(e, acc) {
        if(e) res.send(e);
        //Delete old photo
        if(req.file) unlinkAsync(account.profilePhoto);
        res.json(acc);
      }
    );
  });
};

exports.delete_a_account = function(req, res) {
  Account.remove({ _id: req.params.accountId}, function(err, account) {
    if(err)
      res.send(err);
    res.json({message: 'Account successfully deleted.'});
  });
};
