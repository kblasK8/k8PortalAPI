'use strict';

var mongoose = require('mongoose');

LeaveRequest = mongoose.model('LeaveRequest');

// exports.list_all_leaveRequests = function(req, res) {
//   LeaveRequest.find({}, function(err, leaveRequest) {
//     if(err)
//       res.send(err);
//     res.json(leaveRequest);
//   }); 
// };

exports.list_all_leaveRequests = function(req, res) {
    LeaveRequest.find({ $or: [ { requestor_id: req.params.leaveRequestId }, { approver_id: req.params.leaveRequestId }]}, 
        function(err, leaveRequest) {
    if(err)
        res.send(err);
    res.json(leaveRequest);
    });
};

exports.create_a_leaveRequest = function(req, res) {
  var new_leaveRequest = new LeaveRequest(req.body)
  new_leaveRequest.save(function(err, leaveRequest) {
    if(err)
      res.send(err);
    res.json(leaveRequest);
  });
};

exports.read_a_leaveRequest = function(req, res) {
  LeaveRequest.findById(req.params.leaveRequestId, function(err, leaveRequest) {
    if(err)
      res.send(err);
    res.json(leaveRequest);
  });
};

exports.update_a_leaveRequest = function(req, res) {
  LeaveRequest.findOneAndUpdate({_id: req.params.leaveRequestId}, req.body, {new: true}, function(err, leaveRequest){
    if(err)
      res.send(err);
    res.json(leaveRequest);
  });
};

exports.delete_a_leaveRequest = function(req, res) {
  LeaveRequest.remove({ _id: req.params.leaveRequestId}, function(err, leaveRequest) {
    if(err)
      res.send(err);
    res.json({message: 'Leave Request successfully deleted.'});
  });
};
