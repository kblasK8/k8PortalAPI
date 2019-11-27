var express = require('express');
var app = express();
var router = express.Router();
var upload = require('../middleware/upload');
const tokenCheck = require('../middleware/tokenCheck');

// Require controller modules
var accountController = require('../controllers/accountController');
var departmentController = require('../controllers/departmentController');
var idpController = require('../controllers/idpController');
var leaveRequestController = require('../controllers/leaveRequestController');
var projectController = require('../controllers/projectController');
var requirementController = require('../controllers/requirementController');
var resourceAssignCategoryController = require('../controllers/resourceAssignCategoryController');
var resourceAssignmentController = require('../controllers/resourceAssignmentController');
var resourceAssignRoleController = require('../controllers/resourceAssignRoleController');
var taskController = require('../controllers/taskController');
var uploadsController = require('../controllers/uploadsController');
var wikiController = require('../controllers/wikiController');

// LOGIN ROUTE //
router.route('/api/login')
  .post(tokenCheck, accountController.login_account);
// ACCOUNT ROUTES //
router.route('/api/accounts')
  .get(tokenCheck, accountController.list_all_accounts)
  .post(tokenCheck, accountController.create_a_account);
router.route('/api/accounts/:accountId')
  .get(tokenCheck, accountController.read_a_account)
  .post(tokenCheck, upload.single("file"), accountController.update_a_account)
  .delete(tokenCheck, accountController.delete_a_account);
router.route('/api/accounts/department/:department')
  .get(tokenCheck, accountController.list_all_account_by_department);
router.route('/api/accounts/type/:type')
  .get(tokenCheck, accountController.list_all_account_by_type);
router.route('/api/accounts/search/filter')
  .post(tokenCheck, accountController.filter_account);

// DEPARTMENT ROUTES //
router.route('/api/departments')
  .get(tokenCheck, departmentController.list_all_departments)
  .post(tokenCheck, departmentController.create_a_department);
router.route('/api/departments/:departmentId')
  .get(tokenCheck, departmentController.read_a_department)
  .put(tokenCheck, departmentController.update_a_department)
  .delete(tokenCheck, departmentController.delete_a_department);

// IDP ROUTES //
router.route('/api/idp')
  .get(tokenCheck, idpController.list_all_idps)
  .post(tokenCheck, idpController.create_a_idp);
router.route('/api/idp/:idpId')
  .get(tokenCheck, idpController.read_a_idp)
  .put(tokenCheck, idpController.update_a_idp)
  .delete(tokenCheck, idpController.delete_a_idp);

// LEAVE REQUEST ROUTES //
router.route('/api/leave-request')
  .post(tokenCheck, leaveRequestController.create_a_leaveRequest);
router.route('/api/leave-request/:leaveRequestId')
  .get(tokenCheck, leaveRequestController.list_all_leaveRequests)
  .put(tokenCheck, leaveRequestController.update_a_leaveRequest)
  .delete(tokenCheck, leaveRequestController.delete_a_leaveRequest);

// PROJECT ROUTES //
router.route('/api/projects')
  .get(tokenCheck, projectController.list_all_projects)
  .post(tokenCheck, projectController.create_a_project);
router.route('/api/projects/:projectId')
  .get(tokenCheck, projectController.read_a_project)
  .put(tokenCheck, projectController.update_a_project)
  .delete(tokenCheck, projectController.delete_a_project);
router.route('/api/projectsFilter')
  .post(tokenCheck, projectController.filter_a_project);
router.route('/api/projects/page/:pageNo/:perPage')
  .get(tokenCheck, projectController.page);
router.route('/api/projects/child/:projectId')
  .get(tokenCheck, projectController.read_child_projects)
  .post(tokenCheck, projectController.create_child_projects);

// REQUIREMENT ROUTES //
router.route('/api/requirements')
  .get(tokenCheck, requirementController.list_all_requirements)
  .post(tokenCheck, requirementController.create_a_requirement);
router.route('/api/requirements/:requirementId')
  .get(tokenCheck, requirementController.read_a_requirement)
  .put(tokenCheck, requirementController.update_a_requirement)
  .delete(tokenCheck, requirementController.delete_a_requirement);
router.route('/api/requirements/:projectId/:pageNo/:perPage')
  .get(tokenCheck, requirementController.list_all_project_requirements);
router.route('/api/requirements/:projectId/:type/:pageNo/:perPage')
  .get(tokenCheck, requirementController.list_all_project_requirements_type);

// RESOURCE ASSIGNMENT ROUTES //
router.route('/api/ra')
  .get(tokenCheck, resourceAssignmentController.list_all_ra)
  .post(tokenCheck, resourceAssignmentController.create_a_ra);
router.route('/api/ra/:raId')
  .get(tokenCheck, resourceAssignmentController.read_a_ra)
  .put(tokenCheck, resourceAssignmentController.update_a_ra)
  .delete(tokenCheck, resourceAssignmentController.delete_a_ra);
router.route('/api/raFilter')
  .post(tokenCheck, resourceAssignmentController.filter_ra);

// RESOURCE ASSIGNMENT CATEGORY ROUTES //
router.route('/api/rac')
  .get(tokenCheck, resourceAssignCategoryController.list_all_rac)
  .post(tokenCheck, resourceAssignCategoryController.create_a_rac);
router.route('/api/rac/:racId')
  .get(tokenCheck, resourceAssignCategoryController.read_a_rac)
  .put(tokenCheck, tokenCheck, resourceAssignCategoryController.update_a_rac)
  .delete(tokenCheck, resourceAssignCategoryController.delete_a_rac);

// RESOURCE ASSIGNMENT ROLE ROUTES //
router.route('/api/rar')
  .get(tokenCheck, resourceAssignRoleController.list_all_rar)
  .post(tokenCheck, resourceAssignRoleController.create_a_rar);
router.route('/api/rar/:rarId')
  .get(tokenCheck, resourceAssignRoleController.read_a_rar)
  .put(tokenCheck, resourceAssignRoleController.update_a_rar)
  .delete(tokenCheck, resourceAssignRoleController.delete_a_rar);

// TASK ROUTES //
router.route('/api/tasks')
  .get(tokenCheck, taskController.list_all_tasks)
  .post(tokenCheck, taskController.create_a_task);
router.route('/api/tasks/:taskId')
  .put(tokenCheck, taskController.update_a_task)
  .delete(tokenCheck, taskController.delete_a_task);
router.route('/api/tasksFilter')
  .post(tokenCheck, taskController.filter_a_project_task);

// UPLOADS //
router.route('/api/uploads/:downloadFile')
  .get(tokenCheck, uploadsController.get_file);

// WIKI ROUTES //
router.route('/api/wiki')
  .get(tokenCheck, wikiController.list_all_wikis)
  .post(tokenCheck, upload.array("files", 5), wikiController.create_a_wiki);
router.route('/api/wiki/:wikiId')
  .get(tokenCheck, wikiController.list_all_sub_wikis)
  .post(tokenCheck, upload.array("files", 5), wikiController.update_a_wiki)
  .delete(tokenCheck, wikiController.delete_a_wiki);
router.route('/api/wiki/department/:departmentId/:pageNo/:perPage')
  .get(tokenCheck, wikiController.list_all_department_wikis)
router.route('/api/wikiFilter')
  .post(tokenCheck, wikiController.filter_a_wiki);
router.route('/api/wiki/:wikiId/:filename')
  .delete(tokenCheck, wikiController.delete_wiki_file);

module.exports = router;
