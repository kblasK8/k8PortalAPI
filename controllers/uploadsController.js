const config = require('../config/config');

exports.get_file = (req, res) => {
	const file = config.uploadPath + req.params.downloadFile;
	res.download(file);
}
