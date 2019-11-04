const config = require('../config/config');

exports.get_file = function(req, res) {
  const file = config.uploadPath + req.params.downloadFile;
  console.log(file);
  res.download(file);
};
