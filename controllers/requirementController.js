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
const noAccessRes = (res) => {
  res
  .status(403)
  .json({
    statusCode: 403,
    error: true,
    msg: "Forbidden to access project folder."
  });
  return res;
}
const reqFieldRes = (res, status, msg) => {
  res
  .status(status)
  .json({
    statusCode: status,
    error: true,
    msg: msg
  });
  return res;
}
var hasProjectAccess = (req) => {
  return new Promise((resolve, reject) => {
    const tokenHeader = req.headers['authorization'];
    const bearer = tokenHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      ResourceAssignment.countDocuments(
        {
          $and : [
            { project_id : req.body.projectID },
            {
              "resources.account_id" : authData._id
            }
          ]
        },
        (err, count) => {
          resolve(count);
        });
    });
  });
}

exports.viewFolder = (req, res) => {
  if(
      !req.body.projectID ||
      !req.body.folderPath
  ) {
    return reqFieldRes(res, 400, "Project ID and folder path should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var folderPath = config.uploadPath + req.body.projectID + '/' + req.body.folderPath;
      var obj = {
        path : req.body.folderPath,
        folders : [],
        files : []
      };
      var rootFolder = path.normalize(config.uploadPath + req.body.projectID);
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
          });
          Promise.all(checkFolderFiles).then(() => res.json(obj));
        }
      );
    }
  })();
}

exports.newFolder = (req, res) => {
  if(
    !req.body.projectID ||
    !req.body.path ||
    !req.body.folderName
  ) {
    return reqFieldRes(res, 400, "Project ID, Path and folder name are required.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var dirPath = req.body.projectID + '/' + req.body.path + '/' + req.body.folderName;
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
  })();
};

exports.delFolder = (req, res) => {
  if(
    !req.body.projectID ||
    !req.body.path
  ) {
    return reqFieldRes(res, 400, "Project ID and Path should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var dirPath = req.body.projectID + '/' + req.body.path;
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
  })();
}

exports.delFiles = (req, res) => {
  if(
    !req.body.projectID ||
    !req.body.path
  ) {
    return reqFieldRes(res, 400, "Project ID and Path should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var dirPath = req.body.projectID + '/' + req.body.path;
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
  })();
}

exports.movItem = (req, res) => {
  var oldPath = req.body.oldPath;
  var newPath = req.body.newPath;
  var isArrayBln = false;
  if(
    !req.body.projectID ||
    !oldPath ||
    !newPath
  ) {
    return reqFieldRes(res, 400, "Project ID, old and new path should not be empty.");
  }
  if(
    (!Array.isArray(oldPath) && Array.isArray(newPath)) ||
    (Array.isArray(oldPath) && !Array.isArray(newPath))
  ) {
    return reqFieldRes(res, 400, "If multiple move items, both old and new path should not be array.");
  }
  if(
    Array.isArray(oldPath) &&
    Array.isArray(newPath)
  ) {
    if(oldPath.length !== newPath.length) {
      return reqFieldRes(res, 400, "New and old path are not same in length.");
    } else {
      isArrayBln = true;  
    }
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      if(isArrayBln) {
        var obj = {
          moved : [],
          failed : []
        };
        newPath.forEach((newItem, index) => {
          var dirOldPath = req.body.projectID + '/' + oldPath[index];
          var dirNewPath = req.body.projectID + '/' + newItem;
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
        var dirOldPath = req.body.projectID + '/' + oldPath;
        var dirNewPath = req.body.projectID + '/' + newPath;
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
  })();
}

exports.upload_files = (req, res) => {
  if(
    !req.body.projectID ||
    !req.body.path
  ) {
    return reqFieldRes(res, 400, "Project ID and Path should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var dirOldPath = req.file.path;
      var dirNewPath = "";
      if(!req.body.path) {
        dirNewPath = req.body.projectID;
      } else {
        dirNewPath = req.body.projectID + '/' + req.body.path + '/' + req.file.originalname;
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
  })();
}

exports.search = (req, res) => {
  if(
    !req.body.projectID ||
    !req.body.keyword
  ) {
    return reqFieldRes(res, 400, "Project ID and Keyword should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var rootFolder = path.normalize(config.uploadPath + req.body.projectID);
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
            if (item.name.includes(req.body.keyword)) {
              obj.folders.push({
                folder : item.name,
                path : removeRootFolder(rootFolder, dir),
                size : getFileSize(getStatFileSize(res)),
                created_date : getStatFileCreatedDate(res)
              });
            }
            yield* getFiles(res);
          } else {
            if (item.name.includes(req.body.keyword)) {
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
  })();
}

exports.requirements_download = (req, res) => {
  if(!req.body.path) {
    return reqFieldRes(res, 400, "Download path should not be empty.");
  }
  (async () => {
    if(!await hasProjectAccess(req)) {
      return noAccessRes(res);
    } else {
      var dirPath = req.params.projectID + '/' + req.body.path;
      const downloadFile = path.normalize(config.uploadPath + '/' + dirPath);
      if(fs.existsSync(downloadFile)) {
        res.download(downloadFile);
      } else {
        res.json({ message : "File not exist." });
      }
    }
  })();
};
