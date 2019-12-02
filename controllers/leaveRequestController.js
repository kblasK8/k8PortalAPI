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
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
};

exports.create_a_leaveRequest = (req, res) => {
  var new_leaveRequest = new LeaveRequest(req.body);
  new_leaveRequest.save(
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
};

exports.read_a_leaveRequest = (req, res) => {
  LeaveRequest.findById(
    req.params.leaveRequestId,
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
};

exports.update_a_leaveRequest = (req, res) => {
  LeaveRequest.findOneAndUpdate(
    { _id: req.params.leaveRequestId },
    req.body,
    { new : true },
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(leaveRequest);
    }
  );
};

exports.delete_a_leaveRequest = (req, res) => {
  LeaveRequest.remove(
    { _id: req.params.leaveRequestId },
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json({ message: 'Leave Request successfully deleted.' });
    }
  );
};
