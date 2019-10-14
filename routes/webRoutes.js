'use strict';

module.exports = function(app) {
  var note = require('../controllers/noteController');
  var account = require('../controllers/accountController');
  var department = require('../controllers/departmentController');
  var project = require('../controllers/projectController');
  var task = require('../controllers/taskController');
  var requirement = require('../controllers/requirementController');
  var wiki = require('../controllers/wikiController');
  var idp = require('../controllers/idpController');
  var subProj = require('../controllers/subProjectController');
  var leaveReq = require('../controllers/leaveRequestController');
  var rac = require('../controllers/resourceAssignCategoryController');
  var rar = require('../controllers/resourceAssignRoleController');
  var ra = require('../controllers/resourceAssignmentController');

  // note routes
  app.route('/api/notes')
    .get(note.list_all_notes)
    .post(note.create_a_note);

  app.route('/api/notes/:noteId')
    .get(note.read_a_note)
    .put(note.update_a_note)
    .delete(note.delete_a_note);

  // account route
  app.route('/api/accounts')
    .get(account.list_all_accounts)
    .post(account.create_a_account);

  app.route('/api/accounts/:accountId')
    .get(account.read_a_account)
    .put(account.update_a_account)
    .delete(account.delete_a_account);

  app.route('/api/accountsNU')
    .get(account.list_all_nu_accounts);

  app.route('/api/accountType/:dept')
    .get(account.list_all_account_by_type);

  app.route('/api/accountInDevDept')
    .get(account.list_all_account_in_dev_dept);

  app.route('/api/accountFilter')
    .post(account.filter_account);

  // department route
  app.route('/api/departments')
    .get(department.list_all_departments)
    .post(department.create_a_department);

  app.route('/api/departments/:departmentId')
    .get(department.read_a_department)
    .put(department.update_a_department)
    .delete(department.delete_a_department);

  // project route
  app.route('/api/projects')
    .get(project.list_all_projects)
    .post(project.create_a_project);

  app.route('/api/projects/:projectId')
    .get(project.read_a_project)
    .put(project.update_a_project)
    .delete(project.delete_a_project);

  app.route('/api/projectsFilter')
    .post(project.filter_a_project);

  app.route('/api/projects/page/:pageNo/:perPage')
    .get(project.page);

  // subproject routes
  app.route('/api/subproj')
  .get(subProj.list_all_sub_projs)
  .post(subProj.create_a_sub_proj);

  app.route('/api/subproj')
  .get(subProj.list_all_sub_projs)

  app.route('/api/subproj/:subProjId')
    .get(subProj.read_a_sub_proj)
    .put(subProj.update_a_sub_proj)
    .delete(subProj.delete_a_sub_proj);

  app.route('/api/subprojFilter')
    .post(subProj.filter_sub_proj);

  // task route
  app.route('/api/tasks')
    .get(task.list_all_tasks)
    .post(task.create_a_task);

  app.route('/api/tasks/:taskId')
    .put(task.update_a_task)
    .delete(task.delete_a_task);

  app.route('/api/tasksFilter')
    .post(task.filter_a_project_task)

  // requirements routes
  app.route('/api/requirements')
    .get(requirement.list_all_requirements)
    .post(requirement.create_a_requirement);

  app.route('/api/requirements/:requirementId')
    .get(requirement.read_a_requirement)
    .put(requirement.update_a_requirement)
    .delete(requirement.delete_a_requirement);

  // wiki routes
  app.route('/api/wiki')
  .get(wiki.list_all_wikis)
  .post(wiki.create_a_wiki);

  app.route('/api/wiki/:wikiId')
    // .get(wiki.read_a_wiki)
    .get(wiki.list_all_sub_wikis)
    .put(wiki.update_a_wiki)
    .delete(wiki.delete_a_wiki);

  app.route('/api/wikiFilter')
    .post(wiki.filter_a_wiki);

  //IDP routes
  app.route('/api/idp')
  .get(idp.list_all_idps)
  .post(idp.create_a_idp);

  app.route('/api/idp/:idpId')
    .get(idp.read_a_idp)
    .put(idp.update_a_idp)
    .delete(idp.delete_a_idp);

  //Leave Request routes
  app.route('/api/leave-request')
    // .get(leaveReq.list_all_leaveRequests)
    .post(leaveReq.create_a_leaveRequest);

  app.route('/api/leave-request/:leaveRequestId')
    .get(leaveReq.list_all_leaveRequests)
    .put(leaveReq.update_a_leaveRequest)
    .delete(leaveReq.delete_a_leaveRequest);

  // Resource Assignment Category routes
  app.route('/api/rac')
    .get(rac.list_all_rac)
    .post(rac.create_a_rac);

  app.route('/api/rac/:racId')
    .get(rac.read_a_rac)
    .put(rac.update_a_rac)
    .delete(rac.delete_a_rac);

  // Resource Assignment Role routes
  app.route('/api/rar')
  .get(rar.list_all_rar)
  .post(rar.create_a_rar);

  app.route('/api/rar/:rarId')
    .get(rar.read_a_rar)
    .put(rar.update_a_rar)
    .delete(rar.delete_a_rar);

  // Resource Assignment routes
  app.route('/api/ra')
    .get(ra.list_all_ra)
    .post(ra.create_a_ra);

  app.route('/api/ra/:raId')
    .get(ra.read_a_ra)
    .put(ra.update_a_ra)
    .delete(ra.delete_a_ra);

  app.route('/api/raFilter')
    .post(ra.filter_ra);
}
