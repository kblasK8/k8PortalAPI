const config = require('../config/config');
var SHA256 = require("crypto-js/sha256");
var multer = require("multer");
var path = require('path');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, SHA256(file.originalname + Date.now()) + path.extname(file.originalname));
  }
})
const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/bmp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
var upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2
  }
});

module.exports = upload;