const mongoose = require('mongoose');
const IDP = require('../models/IDPModel');

exports.list_all_idps = (req, res) => {
  IDP.find(
    {},
    { "__v": 0 },
    (err, idps) => {
      if(err) { res.send(err); }
      res.json(idps);
    }
  );
}

exports.create_a_idp = (req, res) => {
  var new_idp = new IDP(req.body);
  new_idp.save(
    (err, idp) => {
      if(err) { res.send(err); }
      var obj = idp.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_idp = (req, res) => {
  IDP.find(
    { userId: req.params.idpId },
    { "__v": 0 },
    (err, idp) => {
      if(err) { res.send(err); }
      res.json(idp);
    }
  );
}

exports.update_a_idp = (req, res) => {
  IDP.findOneAndUpdate(
    { userId: req.params.idpId },
    req.body,
    {
      "fields" : { "__v": 0 },
      new : true
    },
    (err, idp) => {
      if(err) { res.send(err); }
      res.json(idp);
    }
  );
}

exports.delete_a_idp = (req, res) => {
  IDP.remove(
    { userId: req.params.idpId },
    (err, idp) => {
      if(err) { res.send(err); }
      res.json({ message: 'IDP successfully deleted.' });
    }
  );
}
