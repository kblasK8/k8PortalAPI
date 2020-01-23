const mongoose = require('mongoose');
const moment = require('moment');
const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

exports.list_all_tasks = (req, res) => {
  Task.find()
  .select('-__v')
  .exec(
    (err, tasks) => {
      if(err) { res.send(err); }
      res.json(tasks);
    }
  );
}

exports.create_a_task = (req, res) => {
  var new_task = new Task(req.body);
  new_task.save(
    (err, task) => {
      if(err) { res.send(err); }
      var obj = task.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_task = (req, res) => {
  Task.findById(
    req.params.taskId,
    (err, task) => {
      if(err) { res.send(err); }
      res.json(task);
    }
  );
}

exports.filter_a_project_task = (req, res) => {
  Task.find(req.body)
  .select('-__v')
  .exec(
    (err, tasks) => {
      if(err) { res.send(err); }
      res.json(tasks);
    }
  );
}

exports.update_a_task = (req, res) => {
  req.body.updated_date = new moment().format();
  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    req.body,
    { 
      "fields" : { "__v" : 0 },
      new : true
    },
    (err, task) => {
      if(err) { res.send(err); }
      try {
        var projectId = task.project_id;
        Task.aggregate([
          {
            $match : { project_id : mongoose.Types.ObjectId(projectId) }
          },
          {
            $group : {
              _id: "$status",
              total: { $sum: 1 }
            }
          }
        ]).exec(
          (err, tasks) => {
            if(err) { res.send(err); }
            var tasksDone = 0;
            var tasksRemaining = 0;
            tasks.forEach(
              (item, index) => {
                var status = item._id;
                if(status.toLowerCase() === "done"){
                  tasksDone += item.total;
                } else {
                  tasksRemaining += item.total;
                }
              }
            );
            var progress = Math.floor((tasksDone / (tasksDone + tasksRemaining)) * 100);
            Project.findOneAndUpdate(
              { _id: projectId },
              { "progress" : progress },
              { new: true },
              (err, project) => {
                if(err) { res.send(err); }
              }
            );
          }
        );
      }
      catch (e) {
        console.log(e);
      }
      res.json(task);
    }
  );
}

exports.delete_a_task = (req, res) => {
  Task.remove(
    { _id: req.params.taskId },
    (err, task) => {
      if(err) { res.send(err); }
      res.json({ message: 'Task successfully deleted.' });
    }
  );
}
