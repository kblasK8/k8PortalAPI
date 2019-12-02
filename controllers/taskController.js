const mongoose = require('mongoose');
const moment = require('moment');
const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

exports.list_all_tasks = (req, res) => {
  Task.find(
    {},
    (err, task) => {
      if(err) { res.send(err); }
      res.json(task);
    }
  );
};

exports.create_a_task = (req, res) => {
  var new_task = new Task(req.body);
  new_task.save(
    (err, task) => {
      if(err) { res.send(err); }
      res.json(task);
    }
  );
};

exports.read_a_task = (req, res) => {
  Task.findById(
    req.params.taskId,
    (err, task) => {
      if(err) { res.send(err); }
      res.json(task);
    }
  );
};

exports.filter_a_project_task = (req, res) => {
  Task.find(
    req.body,
    (err, task) => {
      if(err) { res.send(err); }
      res.json(task);
    }
  );
};

exports.update_a_task = (req, res) => {
  req.body.updated_date = new moment().format();
  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    req.body,
    { new: true },
    (err, task) => {
      if(err) { res.send(err); }
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
              item._id.forEach(
                (i, j) => {
                  if(i.toLowerCase() === "done"){
                    tasksDone += item.total;
                  } else {
                    tasksRemaining += item.total;
                  }
                }
              );
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
      res.json(task);
    }
  );
};

exports.delete_a_task = (req, res) => {
  Task.remove(
    { _id: req.params.taskId },
    (err, task) => {
      if(err) { res.send(err); }
      res.json({ message: 'Task successfully deleted.' });
    }
  );
};
