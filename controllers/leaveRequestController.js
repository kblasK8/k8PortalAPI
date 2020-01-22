const mongoose = require('mongoose');
const LeaveRequest = require('../models/leaveRequestModel');

exports.list_all_leaveRequests = (req, res) => {
  LeaveRequest.find(
    {
      $or: [
        { requestor_id: req.params.leaveRequestId },
        { approver_id: req.params.leaveRequestId }
      ]
    },
    { "__v": 0 },
    (err, leaveRequests) => {
      if(err) { res.send(err); }
      res.json(leaveRequests);
    }
  );
}

exports.create_a_leaveRequest = (req, res) => {
  var new_leaveRequest = new LeaveRequest(req.body);
  new_leaveRequest.save(
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      var obj = leaveRequest.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_leaveRequest = (req, res) => {
  LeaveRequest.findById(
    req.params.leaveRequestId,
    { "__v": 0 },
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
}

exports.update_a_leaveRequest = (req, res) => {
  LeaveRequest.findOneAndUpdate(
    { _id: req.params.leaveRequestId },
    req.body,
    {
      "fields" : { "__v": 0 },
      new : true
    },
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
}

exports.delete_a_leaveRequest = (req, res) => {
  LeaveRequest.remove(
    { _id: req.params.leaveRequestId },
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json({ message: 'Leave Request successfully deleted.' });
    }
  );
}
