const mongoose = require('mongoose');
const moment = require('moment');
const Shift = require('../models/shiftModel');
const Account = require('../models/accountModel');
var countShift = (shiftId, res) => {
  return new Promise((resolve, reject) => {
    Account.countDocuments(
      { 'shift_id' : shiftId },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}

exports.list_all_shifts = (req, res) => {
  Shift.find()
  .select('-__v')
  .exec(
    (err, shifts) => {
      if(err) { res.send(err); }
      res.json(shifts);
    }
  );
}

exports.create_shift = (req, res) => {
  var new_shift = new Shift(req.body);
  new_shift.save(
    (err, shift) => {
      if(err) { res.send(err); }
      var obj = shift.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_shift = (req, res) => {
  Shift.findById(
    req.params.shiftId,
    { "__v" : 0 },
    (err, shift) => {
      if(err) { res.send(err); }
      res.json(shift);
    }
  );
}

exports.update_shift = (req, res) => {
  req.body.updated_date = new moment().format();
  Shift.findOneAndUpdate(
    { _id : req.params.shiftId },
    req.body,
    {
      "fields" : {
        "__v" : 0
      },
      new : true
    },
    (err, shift) => {
      if(err) { res.send(err); }
      res.json(shift);
    }
  );
}

exports.delete_shift = (req, res) => {
  (async () => {
    if(! await countShift(req.params.shiftId, res)) {
      Shift.remove(
        { _id: req.params.shiftId },
        (err, shift) => {
          if(err) { res.send(err); }
          res.json({ message: 'Shift successfully deleted.' });
        }
      );
    } else {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "Shift currently used in Accounts."
      });
      return;
    }
  })();
}
