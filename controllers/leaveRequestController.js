const mongoose = require('mongoose');
const moment = require('moment');
const LeaveRequest = require('../models/leaveRequestModel');
const Holiday = require('../models/holidayModel');
const Account = require('../models/accountModel');
var removeHoliday = (start_date, end_date, res) => {
  return new Promise((resolve, reject) => {
    Holiday.find()
    .select('-__v')
    .exec(
      (err, holidays) => {
        if(err) { res.send(err); }
        var mStart = moment(start_date, "YYYY-MM-DD");
        var mEnd = moment(end_date, "YYYY-MM-DD");
        var daysLength = Math.abs(mStart.diff(mEnd, 'days')) + 1;
        var flagDates = [];
        holidays.forEach((item, index) => {
          if(!flagDates.includes(item.holiday_date)) {
            if(moment(item.holiday_date).isBetween(mStart, mEnd, null, '[]')) {
              flagDates.push(item.holiday_date);
              --daysLength;
            }
          }
        });
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
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    req.body.total_count = await removeHoliday(start_date, end_date, res);
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
