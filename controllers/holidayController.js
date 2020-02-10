const mongoose = require('mongoose');
const moment = require('moment');
const Holiday = require('../models/holidayModel');

exports.list_all_holidays = (req, res) => {
  Holiday.find()
  .select('-__v')
  .exec(
    (err, holidays) => {
      if(err) { res.send(err); }
      res.json(holidays);
    }
  );
}

exports.filter_holiday = (req, res) => {
  Holiday.find(
    req.body,
    { "__v" : 0 },
    (err, holidays) => {
      if(err) { res.send(err); }
      res.json(holidays);
    }
  );
}

exports.create_holiday = (req, res) => {
  if(!req.body.year) {
    req.body.year = String(moment(req.body.holiday_date,"YYYY/MM/DD").year());
  }
  var new_holiday = new Holiday(req.body);
  new_holiday.save(
    (err, holidays) => {
      if(err) { res.send(err); }
      var obj = holidays.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_holiday = (req, res) => {
  Holiday.findById(
    req.params.holidayId,
    { "__v" : 0 },
    (err, holiday) => {
      if(err) { res.send(err); }
      res.json(holiday);
    }
  );
}

exports.update_holiday = (req, res) => {
  req.body.updated_date = new moment().format();
  Holiday.findOneAndUpdate(
    { _id : req.params.holidayId },
    req.body,
    {
      "fields" : {
        "__v" : 0
      },
      new : true
    },
    (err, holiday) => {
      if(err) { res.send(err); }
      res.json(holiday);
    }
  );
}

exports.delete_holiday = (req, res) => {
  Holiday.deleteOne(
    { _id : req.params.holidayId },
    (err, holiday) => {
      if(err) { res.send(err); }
      res.json({ message : 'Holiday successfully deleted.' });
    }
  );
}
