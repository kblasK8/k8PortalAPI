const jwt = require('jsonwebtoken');
const config = require('../config/config');
const secretKey = config.secretKey;

module.exports = (req, res, next) => {
  // Check all the routes below if token includes in the header //
  // If exist set it as req.token //
  const tokenHeader = req.headers['authorization'];
  if(typeof tokenHeader !== 'undefined') {
    const bearer = tokenHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      if(err) {
        res
        .status(403)
        .json({
          statusCode: 403,
          error: true,
          msg: "Forbidden. Invalid token."
        });
        return;
      } else {
        next();
      }
    });
  } else {
    res
    .status(403)
    .json({
      statusCode: 403,
      error: true,
      msg: "Forbidden. No authorization token."
    });
    return;
  }
}
