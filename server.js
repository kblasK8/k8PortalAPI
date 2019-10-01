var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose');
  Note = require('./models/noteModel');
  Account = require('./models/accountModel');
  Department = require('./models/departmentModel');
  Project = require('./models/projectModel');
  Task = require('./models/taskModel');
  Requirement = require('./models/requirementsModel');
  Wiki = require('./models/wikiModel');
  IDP = require('./models/IDPModel');
  SubProj = require('./models/subProjectModel');
  LeaveRequest = require('./models/leaveRequestModel');
  RecAssignCat = require('./models/resourceAssignmentCategoryModel');
  RecAssignRole = require('./models/resourceAssignmentRoleModel');
  ResourceAssignment = require('./models/resourceAssignmentModel');
  bodyParser = require('body-parser');

  var cors = require('cors');
  app.use(cors());

  // mongoose instance connection url connection
  mongoose.Promise = global.Promise;
  
  mongoose.connect('mongodb://localhost:27017/PortalDB', { useNewUrlParser: true });
  // mongoose.connect('mongodb://localhost/PortalDB', { useNewUrlParser: true });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var routes = require('./routes/webRoutes'); //importing route
  routes(app); //register the route

app.listen(port);

console.log('BB Portal RESTful API server started on: ' + port);
