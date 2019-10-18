'use strict';

const constant = require('../config/const');
var crypto = require('crypto');
var grid = require('gridfs-stream');
var gridFsStorage = require('multer-gridfs-storage');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');

app.use(methodOverride('_method'));

Profile = mongoose.model('Profile');
const conn = mongoose.createConnection(constant.mongodbURL);
let gfs;

// Init stream
conn.once('open', () => {
	gfs = grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
});

// Create storage engine
var storage = new GridFsStorage({
  url: constant.mongodbURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

exports.getProfile = function(req, res) {
  Profile.find({}, function(err, project) {
    if(err)
      res.send(err);
    res.json(project);
  });
};

exports.setProfile = function(req, res) {

}
