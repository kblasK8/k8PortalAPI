const mongoose = require('mongoose');
const Project = require('../models/projectModel');

exports.list_all_projects = (req, res) => {
  Project.find()
  .select('-__v')
  .populate('project_category', '-__v')
  .exec(
    (err, projects) => {
      if(err) { res.send(err); }
      res.json(projects);
    }
  );
}

exports.create_a_project = (req, res) => {
  var new_project = new Project(req.body);
  new_project.save(
    (err, project) => {
      if(err) { res.send(err); }
      Project.findById(project._id)
      .select('-__v')
      .populate('project_category', '-__v')
      .exec(
        (e, proj) => {
          if(e) { res.send(e); }
          res.json(proj);
        }
      );
    }
  );
}

exports.read_a_project = (req, res) => {
  Project.find(
    { _id : req.params.projectId }
  )
  .select('-__v')
  .populate('project_category', '-__v')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      res.json(project);
    }
  );
}

exports.filter_a_project = (req, res) => {
  var params = req.body;
  var pageNo = parseInt(params.pageNo);
  var perPage = parseInt(params.perPage);
  delete params.pageNo;
  delete params.perPage;
  var query = {}
  Object.keys(params).forEach(key => {
    var reg = new RegExp(params[key], 'i');
    query[key] = reg;
  });
  Project.find(query)
  .limit(perPage)
  .skip(perPage * (pageNo - 1))
  .sort({
    name: 'asc'
  })
  .select('-__v')
  .populate('project_category', '-__v')
  .exec(
    (err, data) => {
      if(err) { res.send(err); }
      Project.estimatedDocumentCount(query)
      .exec(
        (e, count) => {
          if(e) { res.send(e); }
          var response = {
            data: data,
            page: pageNo,
            pages: Math.ceil(count / perPage)
          }
          res.json(response);
        }
      );
    }
  );
}

exports.update_a_project = (req, res) => {
  Project.findOneAndUpdate(
    { _id: req.params.projectId },
    req.body,
    { 
      "fields" : { "__v" : 0 },
      new : true
    }
  )
  .populate('project_category', '-__v')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      res.json(project);
    }
  );
}

exports.delete_a_project = (req, res) => {
  Project.remove(
    { _id: req.params.projectId },
    (err, project) => {
      if(err) { res.send(err); }
      res.json({ message: 'Project successfully deleted.' });
    }
  );
}

exports.page = (req, res) => {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  Project.find()
  .limit(perPage)
  .skip(perPage * (pageNo - 1))
  .sort({
    name: 'asc'
  })
  .select('-__v')
  .populate('project_category', '-__v')
  .exec(
    (err, data) => {
      if(err) { res.send(err); }
      Project.estimatedDocumentCount()
      .exec(
        (err, count) => {
          if(err) { res.send(err); }
          var response = {
            data: data,
            page: pageNo,
            pages: Math.ceil(count / perPage)
          }
          res.json(response);
        }
      );
    }
  );
}

exports.read_child_projects = (req, res) => {
  Project.findOne({ _id: req.params.projectId })
  .select('_id child_projects')
  .populate('child_projects.project_id', 'name status')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      res.json(project);
    }
  );
}

exports.create_child_projects = (req, res) => {
  Project.findOneAndUpdate(
    { _id: req.params.projectId },
    req.body,
    {
      "fields" : {
        "_id" : 1,
        "child_projects" : 1
      },
      new : true
    }
  )
  .populate('child_projects.project_id', 'name status')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      res.json(project);
    }
  );
}

exports.create_board = (req, res) => {
  Project.findOne(
    { _id : req.params.projectId }
  )
  .select('boards')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      var boardData = project.boards;
      boardData.push(req.body);
      var obj = {
        boards : boardData
      }
      Project.updateOne(
        { _id : req.params.projectId },
        obj,
        { runValidators: true },
        (e, proj) => {
          res.json(obj);
        }
      );
    }
  );
}

exports.delete_board = (req, res) => {
  Project.findOne(
    { _id : req.params.projectId }
  )
  .select('boards')
  .exec(
    (err, project) => {
      if(err) { res.send(err); }
      var boardData = project.boards;
      var obj = {
        boards : boardData.filter(board => board._id != req.params.boardId)
      }
      Project.updateOne(
        { _id : req.params.projectId },
        obj,
        { runValidators: true },
        (e, proj) => {
          res.json(obj);
        }
      );
    }
  );
}
