'use strict';

var mongoose = require('mongoose');

IDP = mongoose.model('IDP');

exports.list_all_idps = function(req, res) {
  IDP.find({}, function(err, idp) {
    if(err)
      res.send(err);
    res.json(idp);
  });
};

exports.create_a_idp = function(req, res) {
  var new_idp = new IDP(req.body);
  new_idp.save(function(err, idp) {
    if(err)
      res.send(err);
    res.json(idp);
  });
};

exports.read_a_idp = function(req, res) {
  IDP.find({ userId: req.params.idpId}, function(err, idp) {
    if(err)
      res.send(err);
    res.json(idp);
  });
};

exports.update_a_idp = function(req, res) {
  IDP.findOneAndUpdate({userId: req.params.idpId}, req.body, {new: true}, function(err, idp){
    if(err)
      res.send(err);
    res.json(idp);
  });
};

exports.delete_a_idp = function(req, res) {
  IDP.remove({ userId: req.params.idpId}, function(err, idp) {
    if(err)
      res.send(err);
    res.json({message: 'IDP successfully deleted.'});
  });
};
