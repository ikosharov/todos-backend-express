var jwt = require('jwt-simple');
var config = require('../web.config');
var usersController = require('../controllers/users');

module.exports = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token);
  var username = (req.body && req.body.username) || (req.query && req.query.username);

  console.log('validating request...');
  if(token || username) {
    var decoded = jwt.decode(token, config.SECRET);

    if (decoded.exp <= Date.now()) {
      res.status(400);
      res.json({
        "status": 400,
        "message": "Token Expired"
      });
      return;
    }

    usersController.userExists(username, function(err, result){
      if(err || result.length == 0){
        res.status(403);
        res.json({
          "status": 403,
          "message": "Not Authorized"
        });
      }
      else {
        next();
      }
    });
  }
  else {
    res.status(403);
    res.json({
      "status": 403,
      "message": "Not Authorized"
    });
  }
}
