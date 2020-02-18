const mongoose = require('mongoose');
const moment = require('moment-business-days');
const jwt = require('jsonwebtoken');
const LeaveMaster = require('../models/leaveMasterModel');
const LeaveRequest = require('../models/leaveRequestModel');
const Holiday = require('../models/holidayModel');
const Account = require('../models/accountModel');
const config = require('../config/config');
const secretKey = config.secretKey;
var cleanLeaveRequest = (item) => {
  var leave = Object.assign({}, item._doc);
  leave.requestor_fullname = (
    leave.requestor_id.first_name + " " + 
    leave.requestor_id.middle_name + " " + 
    leave.requestor_id.last_name
  ).replace(/ undefined+/g, '');
  leave.approver_fullname = (
    leave.approver_id.first_name + " " + 
    leave.approver_id.middle_name + " " + 
    leave.approver_id.last_name
  ).replace(/ undefined+/g, '');
  leave.leave_type_name = leave.leave_type_id.name
  delete leave.requestor_id;
  delete leave.approver_id;
  delete leave.leave_type_id;
  return leave;
}
var getDayOffs = (req, res) => {
  return new Promise((resolve, reject) => {
    const tokenHeader = req.headers['authorization'];
    const bearer = tokenHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      Account.findById(authData._id)
      .select('-_id shift_id.day_offs')
      .populate('shift_id', 'day_offs -_id')
      .exec(
        (err, account) => {
          if(err) { res.send(err); }
          resolve(account);
        }
      );
    });
  });
}
var removeDayOffsAndHolidays = (start_date, end_date, dayOffs, res) => {
  return new Promise((resolve, reject) => {
    Holiday.find()
    .select('-_id holiday_date')
    .exec(
      (err, holidays) => {
        if(err) { res.send(err); }
        var holidayDates = [];
        holidays.forEach((item, index) => {
          holidayDates.push(item.holiday_date);
        });
        var workingDays = [0, 1, 2, 3, 4, 5, 6].filter(
          x => !dayOffs.includes(x)
        );
        moment.updateLocale('ph', {
          workingWeekdays: workingDays,
          holidays: holidayDates,
          holidayFormat: 'YYYY-MM-DD'
        });
        var count = moment(end_date, 'YYYY-MM-DD').add(1, 'd').businessDiff(moment(start_date, 'YYYY-MM-DD'));
        resolve(count);
      }
    );
  });
}
var getLeaveCountsData = (req, res) => {
  return new Promise((resolve, reject) => {
    const tokenHeader = req.headers['authorization'];
    const bearer = tokenHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      LeaveMaster.findOne(
        { account_id : authData._id },
        {
          "_id" : 0,
          "account_id" : 0,
          "__v" : 0
        },
        (err, account) => {
          if(err) { res.send(err); }
          resolve(account.leaves);
        }
      );
    });
  });
}

exports.list_all_leaveRequests = (req, res) => {
  LeaveRequest.find()
  .select('-__v')
  .populate('leave_type_id', 'name')
  .populate('approver_id', 'first_name middle_name last_name')
  .populate('requestor_id', 'first_name middle_name last_name')
  .exec(
    (err, leaveRequests) => {
      if(err) { res.send(err); }
      var cleanLeaveRequests = leaveRequests.map(item => {
        return cleanLeaveRequest(item);
      });
      res.json(cleanLeaveRequests);
    }
  );
}

exports.create_a_leaveRequest = (req, res) => {
  (async () => {
    var leaveCountsData = await getLeaveCountsData(req, res);
    var countByLeaveType = leaveCountsData.filter(
      item => item.leave_type_id == req.body.leave_type_id
    );
    if(countByLeaveType.length) {
      var dayOffs = await getDayOffs(req, res);
      req.body.total_count = await removeDayOffsAndHolidays(
        req.body.start_date,
        req.body.end_date,
        dayOffs.shift_id.day_offs,
        res
      );
      var diffCount = countByLeaveType[0].remaining - req.body.total_count;
      if(diffCount >= 0) {
        req.body.paid_count = req.body.total_count;
        req.body.unpaid_count = 0;
      } else {
        req.body.paid_count = countByLeaveType[0].remaining;
        req.body.unpaid_count = Math.abs(diffCount);
      }
      var new_leaveRequest = new LeaveRequest(req.body);
      new_leaveRequest.save(
        (err, leaveRequest) => {
          if(err) { res.send(err); }
          var obj = leaveRequest.toObject();
          delete obj.__v;
          res.json(obj);
        }
      );
    } else {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "Account don't have this kind of leave."
      });
      return;
    }
  })();
}

exports.read_a_leaveRequest = (req, res) => {
  LeaveRequest.findById(req.params.leaveRequestId)
  .select('-__v')
  .populate('leave_type_id', 'name')
  .populate('approver_id', 'first_name middle_name last_name')
  .populate('requestor_id', 'first_name middle_name last_name')
  .exec(
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(cleanLeaveRequest(leaveRequest));
    }
  );
}

exports.update_a_leaveRequest = (req, res) => {
  //update leave count
  LeaveRequest.findOneAndUpdate(
    { _id: req.params.leaveRequestId },
    req.body,
    {
      "fields" : { "__v" : 0 },
      new : true
    }
  )
  .populate('leave_type_id', 'name')
  .populate('approver_id', 'first_name middle_name last_name')
  .populate('requestor_id', 'first_name middle_name last_name')
  .exec(
    (err, leaveRequest) => {
      if(err) { res.send(err); }
      res.json(cleanLeaveRequest(leaveRequest));
    }
  );
}

exports.delete_a_leaveRequest = (req, res) => {
  LeaveRequest.countDocuments(
    {
      _id: req.params.leaveRequestId,
      status: ['Pending']
    },
    (err, count) => {
      if(err) { res.send(err); }
      if(count) {
        LeaveRequest.remove(
          {
            _id: req.params.leaveRequestId,
            status: ['Pending']
          },
          (err, leaveRequest) => {
            if(err) { res.send(err); }
            res.json({ message: 'Leave Request successfully deleted.' });
          }
        );
      } else {
        res
        .status(400)
        .json({
          statusCode: 400,
          error: true,
          msg: "Leave request cannot be deleted."
        });
        return;
      }
    }
  );
}
