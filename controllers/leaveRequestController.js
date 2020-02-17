const mongoose = require('mongoose');
const moment = require('moment');
const momentbd = require('moment-business-days');
const jwt = require('jsonwebtoken');
const LeaveRequest = require('../models/leaveRequestModel');
const Holiday = require('../models/holidayModel');
const Account = require('../models/accountModel');
const config = require('../config/config');
const secretKey = config.secretKey;
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
        momentbd.updateLocale('ph', {
          workingWeekdays: workingDays,
          holidays: holidayDates,
          holidayFormat: 'YYYY-MM-DD'
        });
        var daysLength = momentbd(start_date, "YYYY-MM-DD").businessDiff(momentbd(end_date, "YYYY-MM-DD"));
        resolve(daysLength);
      }
    );
  });
}

exports.list_all_leaveRequests = (req, res) => {
  LeaveRequest.find(
    {},
    { "__v": 0 },
    (err, leaveRequests) => {
      if(err) { res.send(err); }
      res.json(leaveRequests);
    }
  );
}

exports.create_a_leaveRequest = (req, res) => {
  //count leaves to be used

  //if remaining leaves based on type is less than or equal
  //to the remaining then save the request

  //count leaves in total
  (async () => {
    var dayOffs = await getDayOffs(req, res);
    req.body.total_count = await removeDayOffsAndHolidays(
      req.body.start_date,
      req.body.end_date,
      dayOffs.shift_id.day_offs,
      res
    );
    var new_leaveRequest = new LeaveRequest(req.body);
    new_leaveRequest.save(
      (err, leaveRequest) => {
        if(err) { res.send(err); }
        var obj = leaveRequest.toObject();
        delete obj.__v;
        res.json(obj);
      }
    );
  })();

  //else return an error that request leaves total count
  //is more than the remaining
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
