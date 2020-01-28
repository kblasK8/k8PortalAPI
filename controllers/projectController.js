const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const ResourceAssignment = require('../models/resourceAssignmentModel');

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
      var resourcesArr = [];
      var getResources = (project_id) => {
        return new Promise((resolve, reject) => {
          ResourceAssignment.find({ project_id : project_id })
          .populate('resources.account_id', 'first_name middle_name last_name')
          .populate('resources.role', '_id name')
          .exec(
            (err, ras) => {
              resolve(ras);
            }
          );
        });
      }
      var mapNames = (resPerProj, rObj) => {
        return new Promise((resolve, reject) => {
          for (var i = 0; i < resPerProj.length; i++) {
            var resDetails = resPerProj[i].resources;
            for (var k = 0; k < resDetails.length; k++) {
              if(resDetails[k].role.name.toLowerCase() == "primary") {
                rObj.primary.push(
                  (
                    resDetails[k].account_id.first_name + 
                    " " + 
                    resDetails[k].account_id.middle_name +
                    " " +
                    resDetails[k].account_id.last_name
                  ).replace(/ undefined+/g, '')
                );
              }
              if(resDetails[k].role.name.toLowerCase() == "secondary") {
                rObj.secondary.push(
                  (
                    resDetails[k].account_id.first_name + 
                    " " + 
                    resDetails[k].account_id.middle_name +
                    " " +
                    resDetails[k].account_id.last_name
                  ).replace(/ undefined+/g, '')
                );
              }
            }//for
          }
          resolve(rObj);
        });
      }
      var mapProjIDResources = (data, resourcesArr) => {
        return new Promise((resolve, reject) => {
          var mapData = data.map(item => {
            var container = {};
            for (var i = 0; i < resourcesArr.length; i++) {
              if(item._id == resourcesArr[i].project_id) {
                container = Object.assign({}, item._doc);
                container.primary = resourcesArr[i].primary;
                container.secondary = resourcesArr[i].secondary;
                break;
              }
            }
            return container;
          });
          resolve(Promise.all(mapData));
        });
      }
      (async () => {
        for (var i = 0; i < data.length; i++) {
          var rObj = {
            project_id : data[i]._id,
            primary : [],
            secondary :[]
          }
          var rPer = await getResources(data[i]._id);
          if(rPer.length) {
            resourcesArr.push(await mapNames(rPer, rObj))
          } else {
            resourcesArr.push(rObj);
          }
        }//for
        data = await mapProjIDResources(data, resourcesArr);
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
      })();
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
