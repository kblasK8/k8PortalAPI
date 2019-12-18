const moment = require('moment');
const mongoose = require('mongoose');
const Requirement = require('../models/requirementsModel');
const ResourceAssignment = require('../models/resourceAssignmentModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const config = require('../config/config');
const secretKey = config.secretKey;
const fs = require('fs');
const { resolve } = require('path');
const { readdir } = require('fs').promises;

const getFileSize = (size) => {
  var i = Math.floor( Math.log(size) / Math.log(1024) );
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['b','kb','mb','gb','tb'][i];
}

const getStatFileSize = (file) => {
  return fs.lstatSync(file).size;
}

const getStatFileCreatedDate = (file) => {
  return fs.lstatSync(file).ctime;
}

const removeRootFolder = (rootFolder, pathFolder) => {
  if(pathFolder == rootFolder) {
    return pathFolder.replace(rootFolder, "");
  } else {
    return pathFolder.replace(rootFolder + '/', "");
  }
}

exports.viewFolder = (req, res) => {
  var projectID = req.body.projectID;
  var reqfolderPath = req.body.folderPath;
  if(
      !projectID ||
      !reqfolderPath
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID and folder path should not be empty."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var folderPath = config.uploadPath + projectID + '/' + reqfolderPath;
          var obj = {
            path : reqfolderPath,
            folders : [],
            files : []
          };
          var rootFolder = path.normalize(config.uploadPath + projectID);
          if(!fs.existsSync(rootFolder)) {
            fs.mkdirSync(
              rootFolder,
              { recursive : true }
            );
          }
          fs.readdir(
            path.normalize(folderPath),
            (err, files) => {
              if(err) {
                res
                .status(400)
                .json({
                  statusCode: 400,
                  error: true,
                  msg: "Folder path invalid."
                });
                return;
              }
              let isFileDir = (file, cb) => {
                fs.lstat(
                  path.normalize(folderPath + '/' + file),
                  (err, stats) => {
                    if(err) { res.send(err); }
                    if(stats.isDirectory()) {
                      obj.folders.push({
                        folder : file,
                        size : getFileSize(stats.size),
                        created_date : stats.ctime
                      });
                    } else {
                      obj.files.push({
                        file : file,
                        size : getFileSize(stats.size),
                        created_date : stats.ctime
                      });
                    }
                    cb();
                  }
                );
              }
              let checkFolderFiles = files.map((file) => {
                return new Promise((resolve) => {
                  isFileDir(file, resolve);
                });
              })
              Promise.all(checkFolderFiles).then(() => res.json(obj));
            }
          );
        }
      }
    );
  });
}

exports.newFolder = (req, res) => {
  var projectID = req.body.projectID;
  var reqPath = req.body.path;
  var folderName = req.body.folderName;
  if(
    !projectID ||
    !reqPath ||
    !folderName
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID, Path and folder name are required."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var dirPath = projectID + '/' + reqPath + '/' + folderName;
          var pathFolder = path.normalize(config.uploadPath + '/' + dirPath);
          if(!fs.existsSync(pathFolder)) {
            fs.mkdir(
              pathFolder,
              { recursive : true },
              (err, cb) => {
                if(err) { res.send(err); }
                res.json({ message : "Directory created." });
              }
            );
          } else {
            res.json({ message : "Directory exists." });
          }
        }
      }
    );
  });
};

exports.delFolder = (req, res) => {
  var projectID = req.body.projectID;
  var reqPath = req.body.path;
  if(
    !projectID ||
    !reqPath
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID and Path should not be empty."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var dirPath = projectID + '/' + reqPath;
          var pathFolder = path.normalize(config.uploadPath + '/' + dirPath);
          if(fs.existsSync(pathFolder)) {
            fs.rmdir(
              pathFolder,
              { recursive : true },
              (err, cb) => {
                if(err) { res.send(err); }
                res.json({ message : "Directory deleted." });
              }
            );
          } else {
            res.json({ message : "Directory not exists." });
          }
        }
      }
    );
  });
}

exports.delFiles = (req, res) => {
  var projectID = req.body.projectID;
  var reqPath = req.body.path;
  if(
    !projectID ||
    !reqPath
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID and Path should not be empty."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var dirPath = projectID + '/' + reqPath;
          var pathFile = path.normalize(config.uploadPath + '/' + dirPath);
          if(fs.existsSync(pathFile)) {
            fs.unlink(
              pathFile,
              (err, cb) => {
                if(err) { res.send(err); }
                res.json({ message : "File deleted." });
              }
            );
          } else {
            res.json({ message : "File not exist." });
          }
        }
      }
    );
  });
}

exports.movItem = (req, res) => {
  var projectID = req.body.projectID;
  var oldPath = req.body.oldPath;
  var newPath = req.body.newPath;
  var isArrayBln = false;
  if(
    !projectID ||
    !oldPath ||
    !newPath
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID, old and new path should not be empty."
    });
    return;
  }
  if(
    (!Array.isArray(oldPath) && Array.isArray(newPath)) ||
    (Array.isArray(oldPath) && !Array.isArray(newPath))
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "If multiple move items, both old and new path should not be array."
    });
    return;
  }
  if(
    Array.isArray(oldPath) &&
    Array.isArray(newPath)
  ) {
    if(oldPath.length !== newPath.length) {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "New and old path are not same in length."
      });
      return;
    } else {
      isArrayBln = true;  
    }
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          if(isArrayBln) {
            var obj = {
              moved : [],
              failed : []
            };
            newPath.forEach((newItem, index) => {
              var dirOldPath = projectID + '/' + oldPath[index];
              var dirNewPath = projectID + '/' + newItem;
              var mvPathOld = path.normalize(config.uploadPath + '/' + dirOldPath);
              var mvPathNew = path.normalize(config.uploadPath + '/' + dirNewPath);
              if(fs.existsSync(mvPathOld)) {
                fs.rename(
                  mvPathOld,
                  mvPathNew,
                  (err, cb) => {
                    if(err) { res.send(err); }
                    obj.moved.push(oldPath[index]);
                  }
                );
              } else {
                obj.failed.push(oldPath[index]);
              }
            });
            // res.json(obj);
            res.json({ message : "Moved successfully." });
          } else {
            var dirOldPath = projectID + '/' + oldPath;
            var dirNewPath = projectID + '/' + newPath;
            var mvPathOld = path.normalize(config.uploadPath + '/' + dirOldPath);
            var mvPathNew = path.normalize(config.uploadPath + '/' + dirNewPath);
            if(fs.existsSync(mvPathOld)) {
              fs.rename(
                mvPathOld,
                mvPathNew,
                (err, cb) => {
                  if(err) { res.send(err); }
                  res.json({ message : "Moved successfully." });
                }
              );
            } else {
              res.json({ message : "Item not exist." });
            }
          }
        }
      }
    );
  });
}

exports.upload_files = (req, res) => {
  var projectID = req.body.projectID;
  var reqPath = req.body.path;
  if(
    !projectID ||
    !reqPath
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID and Path should not be empty."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var dirOldPath = req.file.path;
          var dirNewPath = "";
          if(!reqPath) {
            dirNewPath = projectID;
          } else {
            dirNewPath = projectID + '/' + reqPath + '/' + req.file.originalname;
          }
          var mvPathOld = path.normalize(dirOldPath);
          var mvPathNew = path.normalize(config.uploadPath + '/' + dirNewPath);
          if(fs.existsSync(mvPathOld)) {
            if(!fs.existsSync(mvPathNew)) {
              fs.rename(
                mvPathOld,
                mvPathNew,
                (err, cb) => {
                  if(err) { res.send(err); }
                  res.json({ message : "File(s) uploaded." });
                }
              );
            } else {
              fs.unlink(
                mvPathOld,
                (err, cb) => {
                  if(err) { res.send(err); }
                  res.json({ message : "File(s) already exist." });
                }
              );
            }
          } else {
            res.json({ message : "Temp file does not exist." });
          }
        }
      }
    );
  });
}

exports.search = (req, res) => {
  var projectID = req.body.projectID;
  var keyword = req.body.keyword;
  if(
    !projectID ||
    !keyword
  ) {
    res
    .status(400)
    .json({
      statusCode: 400,
      error: true,
      msg: "Project ID and Keyword should not be empty."
    });
    return;
  }
  const tokenHeader = req.headers['authorization'];
  const bearer = tokenHeader.split(' ');
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, secretKey, (err, authData) => {
    ResourceAssignment.countDocuments(
      {
        $and : [
          { project_id : projectID },
          {
            "resources.account_id" : authData._id
          }
        ]
      },
      (err, count) => {
        if(!count) {
          res
          .status(403)
          .json({
            statusCode: 403,
            error: true,
            msg: "Forbidden to access project folder."
          });
          return;
        } else {
          var rootFolder = path.normalize(config.uploadPath + projectID);
          var obj = {
            path : '/',
            folders : [],
            files : []
          };
          if(!fs.existsSync(rootFolder)) {
            fs.mkdirSync(
              rootFolder,
              { recursive : true }
            );
          }
          async function* getFiles(dir) {
            const items = await readdir(dir, { withFileTypes: true });
            for (const item of items) {
              const res = path.normalize(dir + '/' + item.name);
              if (item.isDirectory()) {
                if (item.name.includes(keyword)) {
                  obj.folders.push({
                    folder : item.name,
                    path : removeRootFolder(rootFolder, dir),
                    size : getFileSize(getStatFileSize(res)),
                    created_date : getStatFileCreatedDate(res)
                  });
                }
                yield* getFiles(res);
              } else {
                if (item.name.includes(keyword)) {
                  obj.files.push({
                    file : item.name,
                    path : removeRootFolder(rootFolder, dir),
                    size : getFileSize(getStatFileSize(res)),
                    created_date : getStatFileCreatedDate(res)
                  });
                }
                yield res;
              }
            }
          }
          (async () => {
            for await (const f of getFiles(rootFolder)) { }
            res.json(obj);
          })();
        }
      }
    );
  });
}
