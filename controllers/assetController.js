const mongoose = require('mongoose');
const Asset = require('../models/assetModel');

exports.list_all_assets = (req, res) => {
  Asset.find()
  .select('-__v')
  .populate('assigned_to', '-__v -password')
  .exec(
    (err, assets) => {
      if(err) { res.send(err); }
      res.json(assets);
    }
  );
}

exports.create_a_asset = (req, res) => {
  var new_asset = new Asset(req.body);
  new_asset.save(
    (err, asset) => {
      if(err) { res.send(err); }
      Asset.findById(asset._id)
      .select('-__v')
      .populate('assigned_to', '-__v -password')
      .exec(
        (e, assetPopulated) => {
          if(e) { res.send(e); }
          res.json(assetPopulated);
        }
      );
    }
  );
}

exports.read_a_asset = (req, res) => {
  Asset.find(
    { _id : req.params.assetId }
  )
  .select('-__v')
  .populate('assigned_to', '-__v -password')
  .exec(
    (err, asset) => {
      if(err) { res.send(err); }
      res.json(asset);
    }
  );
}

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
    (err, asset) => {
      if(err) { res.send(err); }
      res.json(asset);
    }
  );
}
