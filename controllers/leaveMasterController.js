const mongoose = require('mongoose');
const moment = require('moment');
const LeaveMaster = require('../models/leaveMasterModel');
var cleanLeaveMaster = (item) => {
  var leave = Object.assign({}, item._doc);
  leave.account_fullname = (
    leave.account_id.first_name + " " + 
    leave.account_id.middle_name + " " + 
    leave.account_id.last_name
  ).replace(/ undefined+/g, '');
  leave.account_id = leave.account_id._id;
  leave.leaves = leave.leaves.map(item => {
    var itemObj = Object.assign({}, item._doc);
    itemObj.leave_type_name = item.leave_type_id.name;
    delete itemObj.leave_type_id;
    return itemObj;
  });
  return leave;
}

var cleanLeaveTypes = (item) => {
  var leave = Object.assign({}, item._doc);
  leave.account_fullname = (
    leave.account_id.first_name + " " + 
    leave.account_id.middle_name + " " + 
    leave.account_id.last_name
  ).replace(/ undefined+/g, '');
  leave.leaves = leave.leave_type_id.name
  return leave;
}

exports.list_all_leaveMaster = (req, res) => {
  LeaveMaster.find()
  .select('-__v')
  .populate('account_id', 'first_name middle_name last_name')
  .populate('leaves.leave_type_id', 'name')
  .exec(
    (err, leaveMasters) => {
      if(err) { res.send(err); }
      var cleanLeaveMasters = leaveMasters.map(item => {
        return cleanLeaveMaster(item);
      });
      res.json(cleanLeaveMasters);
    }
  );
}

exports.create_a_leaveMaster = (req, res) => {
  var leavesData = req.body.leaves;
  if(leavesData.length) {
    req.body.leaves = leavesData.map(
      (item) => {
        item.remaining = item.total_count
        return item;
      }
    );
  }
  var new_leaveMaster = new LeaveMaster(req.body);
  new_leaveMaster.save(
    (err, leaveMaster) => {
      if(err) { res.send(err); }
      var obj = leaveMaster.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_leaveMaster = (req, res) => {
  LeaveMaster.findById(req.params.leaveMasterId)
  .select('-__v')
  .populate('account_id', 'first_name middle_name last_name')
  .populate('leaves.leave_type_id', 'name')
  .exec(
    (err, leaveMaster) => {
      if(err) { res.send(err); }
      res.json(cleanLeaveMaster(leaveMaster));
    }
  );
}

exports.update_a_leaveMaster = (req, res) => {
  LeaveMaster.findOneAndUpdate(
    { _id: req.params.leaveMasterId },
    req.body,
    {
      "fields" : { "__v" : 0 },
      new : true
    }
  )
  .populate('account_id', 'first_name middle_name last_name')
  .populate('leaves.leave_type_id', 'name')
  .exec(
    (err, leaveMaster) => {
      if(err) { res.send(err); }
      res.json(cleanLeaveMaster(leaveMaster));
    }
  );
}
