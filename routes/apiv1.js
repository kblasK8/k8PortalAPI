var express = require('express');
var app = express();
var router = express.Router();
var upload = require('../middleware/upload');
const tokenCheck = require('../middleware/tokenCheck');

// Require controller modules
var accountController = require('../controllers/accountController');
var assetController = require('../controllers/assetController');
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
router.route('/login')
  .post(accountController.login_account);

// ACCOUNT ROUTES //
router.route('/accounts')
  .get(tokenCheck, accountController.list_all_accounts)
  .post(tokenCheck, accountController.create_a_account);
router.route('/accounts/me')
  .get(tokenCheck, accountController.auth_me);
router.route('/accounts/:accountId')
  .get(tokenCheck, accountController.read_a_account)
  .post(
    tokenCheck,
    upload.single("file"),
    accountController.update_a_account
  )
  .delete(tokenCheck, accountController.delete_a_account);
router.route('/accounts/department/:department')
  .get(tokenCheck, accountController.list_all_account_by_department);
router.route('/accounts/type/:type')
  .get(tokenCheck, accountController.list_all_account_by_type);
router.route('/accounts/search/filter')
  .post(tokenCheck, accountController.filter_account);

// ASSET ROUTES //
router.route('/assets')
  .get(tokenCheck, assetController.list_all_assets)
  .post(tokenCheck, assetController.create_a_asset);
router.route('/assets/:assetId')
  .get(tokenCheck, assetController.read_a_asset)
  .put(tokenCheck, assetController.update_a_asset);

// DEPARTMENT ROUTES //
router.route('/departments')
  .get(tokenCheck, departmentController.list_all_departments)
  .post(tokenCheck, departmentController.create_a_department);
router.route('/departments/:departmentId')
  .get(tokenCheck, departmentController.read_a_department)
  .put(tokenCheck, departmentController.update_a_department)
  .delete(tokenCheck, departmentController.delete_a_department);

// IDP ROUTES //
router.route('/idp')
  .get(tokenCheck, idpController.list_all_idps)
  .post(tokenCheck, idpController.create_a_idp);
router.route('/idp/:idpId')
  .get(tokenCheck, idpController.read_a_idp)
  .put(tokenCheck, idpController.update_a_idp)
  .delete(tokenCheck, idpController.delete_a_idp);

// LEAVE REQUEST ROUTES //
router.route('/leave-request')
  .post(tokenCheck, leaveRequestController.create_a_leaveRequest);
router.route('/leave-request/:leaveRequestId')
  .get(tokenCheck, leaveRequestController.list_all_leaveRequests)
  .put(tokenCheck, leaveRequestController.update_a_leaveRequest)
  .delete(tokenCheck, leaveRequestController.delete_a_leaveRequest);

// PROJECT ROUTES //
router.route('/projects')
  .get(tokenCheck, projectController.list_all_projects)
  .post(tokenCheck, projectController.create_a_project);
router.route('/projects/:projectId')
  .get(tokenCheck, projectController.read_a_project)
  .put(tokenCheck, projectController.update_a_project)
  .delete(tokenCheck, projectController.delete_a_project);
router.route('/projectsFilter')
  .post(tokenCheck, projectController.filter_a_project);
router.route('/projects/page/:pageNo/:perPage')
  .get(tokenCheck, projectController.page);
router.route('/projects/child/:projectId')
  .get(tokenCheck, projectController.read_child_projects)
  .post(tokenCheck, projectController.create_child_projects);
router.route('/projects/boards/:projectId')
  .post(tokenCheck, projectController.create_board);
router.route('/projects/boards/:projectId/:boardId')
  .delete(tokenCheck, projectController.delete_board);

// REQUIREMENT ROUTES //
router.route('/requirements/viewfolder')
  .post(tokenCheck, requirementController.viewFolder)
router.route('/requirements/folder')
  .post(tokenCheck, requirementController.newFolder)
  .delete(tokenCheck, requirementController.delFolder);
router.route('/requirements/move')
  .post(tokenCheck, requirementController.movItem);
router.route('/requirements/search')
  .post(tokenCheck, requirementController.search);
router.route('/requirements/upload')
  .post(
    tokenCheck,
    upload.single("file"),
    requirementController.upload_files
  )
  .delete(tokenCheck, requirementController.delFiles);
router.route('/requirements/download/:projectID')
  .post(tokenCheck, requirementController.requirements_download);

// RESOURCE ASSIGNMENT ROUTES //
router.route('/ra')
  .get(tokenCheck, resourceAssignmentController.list_all_ra)
  .post(tokenCheck, resourceAssignmentController.create_a_ra);
router.route('/ra/:raId')
  .get(tokenCheck, resourceAssignmentController.read_a_ra)
  .put(tokenCheck, resourceAssignmentController.update_a_ra)
  .delete(tokenCheck, resourceAssignmentController.delete_a_ra);
router.route('/raFilter')
  .post(tokenCheck, resourceAssignmentController.filter_ra);

// RESOURCE ASSIGNMENT CATEGORY ROUTES //
router.route('/rac')
  .get(tokenCheck, resourceAssignCategoryController.list_all_rac)
  .post(tokenCheck, resourceAssignCategoryController.create_a_rac);
router.route('/rac/:racId')
  .get(tokenCheck, resourceAssignCategoryController.read_a_rac)
  .put(tokenCheck, tokenCheck, resourceAssignCategoryController.update_a_rac)
  .delete(tokenCheck, resourceAssignCategoryController.delete_a_rac);

// RESOURCE ASSIGNMENT ROLE ROUTES //
router.route('/rar')
  .get(tokenCheck, resourceAssignRoleController.list_all_rar)
  .post(tokenCheck, resourceAssignRoleController.create_a_rar);
router.route('/rar/:rarId')
  .get(tokenCheck, resourceAssignRoleController.read_a_rar)
  .put(tokenCheck, resourceAssignRoleController.update_a_rar)
  .delete(tokenCheck, resourceAssignRoleController.delete_a_rar);

// TASK ROUTES //
router.route('/tasks')
  .get(tokenCheck, taskController.list_all_tasks)
  .post(tokenCheck, taskController.create_a_task);
router.route('/tasks/:taskId')
  .put(tokenCheck, taskController.update_a_task)
  .delete(tokenCheck, taskController.delete_a_task);
router.route('/tasksFilter')
  .post(tokenCheck, taskController.filter_a_project_task);

// UPLOADS //
router.route('/uploads/:downloadFile')
  .get(uploadsController.get_file);

// WIKI ROUTES //
router.route('/wiki')
  .get(tokenCheck, wikiController.list_all_wikis)
  .post(
    tokenCheck,
    upload.array("files", 5),
    wikiController.create_a_wiki
  );
router.route('/wiki/:wikiId')
  .get(tokenCheck, wikiController.read_a_wiki)
  .post(
    tokenCheck,
    upload.array("files", 5),
    wikiController.update_a_wiki
  )
  .delete(tokenCheck, wikiController.delete_a_wiki);
router.route('/wiki/department/:departmentId/:pageNo/:perPage')
  .get(tokenCheck, wikiController.list_all_department_wikis)
router.route('/wikiFilter')
  .post(tokenCheck, wikiController.filter_a_wiki);
router.route('/wiki/:wikiId/:filename')
  .delete(tokenCheck, wikiController.delete_wiki_file);

module.exports = router;
