const mongoose = require('mongoose');
const LeaveType = require('../models/leaveTypeModel');
const LeaveRequest = require('../models/leaveRequestModel');
var countLeaveType = (leaveTypeID, res) => {
  return new Promise((resolve, reject) => {
    LeaveRequest.countDocuments(
      { 'leave_type_id' : leaveTypeID },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}

exports.list_all_leave_types = (req, res) => {
  LeaveType.find()
  .select('-__v')
  .exec(
    (err, leaveTypes) => {
      if(err) { res.send(err); }
      res.json(leaveTypes);
    }
  );
}

exports.create_a_leave_type = (req, res) => {
  var new_leave_type = new LeaveType(req.body);
  new_leave_type.save(
    (err, leaveType) => {
      if(err) {
        res.send(err);
        return;
      }
      var obj = leaveType.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_leave_type = (req, res) => {
  LeaveType.findById(
    req.params.leaveTypeID,
    (err, leaveType) => {
      if(err) { res.send(err); }
      var obj = leaveType.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.update_a_leave_type = (req, res) => {
  LeaveType.findOneAndUpdate(
    { _id: req.params.leaveTypeID },
    req.body,
    { 
      "fields" : { "__v" : 0 },
      new : true
    },
    (err, leaveType) => {
      if(err) { res.send(err); }
      res.json(leaveType);
    }
  );
}

exports.delete_a_leave_type = (req, res) => {
  (async () => {
    if(! await countLeaveType(req.params.leaveTypeID, res)) {
      LeaveType.remove(
        { _id: req.params.leaveTypeID },
        (err, leaveType) => {
          if(err) { res.send(err); }
          res.json({ message: 'Leave type successfully deleted.' });
        }
      );
    } else {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "Leave type currently used in Leave Requests."
      });
      return;
    }
  })();
}
