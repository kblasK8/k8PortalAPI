const mongoose = require('mongoose');
const Asset = require('../models/assetModel');

exports.list_all_assets = (req, res) => {
  Asset.find()
  .select('-__v')
  .populate('assigned_to', '-__v -password')
  .exec(
    (err, ast) => {
      if(err) { res.send(err); }
      res.json(ast);
    }
  );
};

exports.create_a_asset = (req, res) => {
  var new_asset = new Asset(req.body);
  new_asset.save(
    (err, ast) => {
      if(err) { res.send(err); }
      Asset.findById(ast._id)
      .select('-__v')
      .populate('assigned_to', '-__v -password')
      .exec(
        (e, as) => {
          if(e) { res.send(e); }
          res.json(as);
        }
      );
    }
  );
};

exports.read_a_asset = (req, res) => {
  Asset.find(
    { _id : req.params.assetId }
  )
  .select('-__v')
  .populate('assigned_to', '-__v -password')
  .exec(
    (err, ast) => {
      if(err) { res.send(err); }
      res.json(ast);
    }
  );
};

exports.update_a_asset = (req, res) => {
  Asset.findOneAndUpdate(
    { _id: req.params.assetId },
    req.body,
    {
      "fields" : { "__v" : 0 },
      new : true
    }
  )
  .populate('assigned_to', '-__v -password')
  .exec(
    (err, ast) => {
      if(err) { res.send(err); }
      res.json(ast);
    }
  );
};
