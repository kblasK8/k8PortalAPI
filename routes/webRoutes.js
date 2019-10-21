var express = require('express');
var router = express.Router();
var upload = require('../middleware/upload');

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
var subProjectController = require('../controllers/subProjectController');
var taskController = require('../controllers/taskController');
var wikiController = require('../controllers/wikiController');

/// ACCOUNT ROUTES ///
router.route('/api/accounts')
  .get(accountController.list_all_accounts)
  .post(accountController.create_a_account);
router.route('/api/accounts/:accountId')
  .get(accountController.read_a_account)
  .post(upload.single("file"), accountController.update_a_account)
  .delete(accountController.delete_a_account);
router.route('/api/accountsNU')
  .get(accountController.list_all_nu_accounts);
router.route('/api/accountType/:dept')
  .get(accountController.list_all_account_by_type);
router.route('/api/accountInDevDept')
  .get(accountController.list_all_account_in_dev_dept);
router.route('/api/accountFilter')
  .post(accountController.filter_account);

/// DEPARTMENT ROUTES ///
router.route('/api/departments')
  .get(departmentController.list_all_departments)
  .post(departmentController.create_a_department);
router.route('/api/departments/:departmentId')
  .get(departmentController.read_a_department)
  .put(departmentController.update_a_department)
  .delete(departmentController.delete_a_department);

/// PROJECT ROUTES ///
router.route('/api/projects')
  .get(projectController.list_all_projects)
  .post(projectController.create_a_project);
router.route('/api/projects/:projectId')
  .get(projectController.read_a_project)
  .put(projectController.update_a_project)
  .delete(projectController.delete_a_project);
router.route('/api/projectsFilter')
  .post(projectController.filter_a_project);
router.route('/api/projects/page/:pageNo/:perPage')
  .get(projectController.page);

/// SUBPROJECT ROUTES ///
router.route('/api/subproj')
  .get(subProjectController.list_all_sub_projs)
  .post(subProjectController.create_a_sub_proj);
router.route('/api/subproj')
  .get(subProjectController.list_all_sub_projs);
router.route('/api/subproj/:subProjId')
  .get(subProjectController.read_a_sub_proj)
  .put(subProjectController.update_a_sub_proj)
  .delete(subProjectController.delete_a_sub_proj);
router.route('/api/subprojFilter')
  .post(subProjectController.filter_sub_proj);

/// TASK ROUTES ///
router.route('/api/tasks')
  .get(taskController.list_all_tasks)
  .post(taskController.create_a_task);
router.route('/api/tasks/:taskId')
  .put(taskController.update_a_task)
  .delete(taskController.delete_a_task);
router.route('/api/tasksFilter')
  .post(taskController.filter_a_project_task);

/// REQUIREMENT ROUTES ///
router.route('/api/requirements')
  .get(requirementController.list_all_requirements)
  .post(requirementController.create_a_requirement);
router.route('/api/requirements/:requirementId')
  .get(requirementController.read_a_requirement)
  .put(requirementController.update_a_requirement)
  .delete(requirementController.delete_a_requirement);

/// WIKI ROUTES ///
router.route('/api/wiki')
  .get(wikiController.list_all_wikis)
  .post(wikiController.create_a_wiki);
router.route('/api/wiki/:wikiId')
  .get(wikiController.list_all_sub_wikis)
  .put(wikiController.update_a_wiki)
  .delete(wikiController.delete_a_wiki);
router.route('/api/wikiFilter')
  .post(wikiController.filter_a_wiki);

/// IDP ROUTES ///
router.route('/api/idp')
  .get(idpController.list_all_idps)
  .post(idpController.create_a_idp);
router.route('/api/idp/:idpId')
  .get(idpController.read_a_idp)
  .put(idpController.update_a_idp)
  .delete(idpController.delete_a_idp);

/// LEAVE REQUEST ROUTES ///
router.route('/api/leave-request')
  .post(leaveRequestController.create_a_leaveRequest);
router.route('/api/leave-request/:leaveRequestId')
  .get(leaveRequestController.list_all_leaveRequests)
  .put(leaveRequestController.update_a_leaveRequest)
  .delete(leaveRequestController.delete_a_leaveRequest);

/// RESOURCE ASSIGNMENT CATEGORY ROUTES ///
router.route('/api/rac')
  .get(resourceAssignCategoryController.list_all_rac)
  .post(resourceAssignCategoryController.create_a_rac);
router.route('/api/rac/:racId')
  .get(resourceAssignCategoryController.read_a_rac)
  .put(resourceAssignCategoryController.update_a_rac)
  .delete(resourceAssignCategoryController.delete_a_rac);

/// RESOURCE ASSIGNMENT ROLE ROUTES ///
router.route('/api/rar')
  .get(resourceAssignRoleController.list_all_rar)
  .post(resourceAssignRoleController.create_a_rar);
router.route('/api/rar/:rarId')
  .get(resourceAssignRoleController.read_a_rar)
  .put(resourceAssignRoleController.update_a_rar)
  .delete(resourceAssignRoleController.delete_a_rar);

/// RESOURCE ASSIGNMENT ROUTES ///
router.route('/api/ra')
  .get(resourceAssignmentController.list_all_ra)
  .post(resourceAssignmentController.create_a_ra);
router.route('/api/ra/:raId')
  .get(resourceAssignmentController.read_a_ra)
  .put(resourceAssignmentController.update_a_ra)
  .delete(resourceAssignmentController.delete_a_ra);
router.route('/api/raFilter')
  .post(resourceAssignmentController.filter_ra);

module.exports = router;
