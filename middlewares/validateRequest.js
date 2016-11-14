var jwt = require('jwt-simple');
var config = require('../web.config');
var usersController = require('../controllers/users');

module.exports = function(req, res, next) {
  var token = req.headers["access_token"];

  console.log('validating request...');
  
  if(token) {
    var decoded = jwt.decode(token, config.SECRET);
    console.log('access_token successfully decoded');
    
    if (decoded.exp <= Date.now()) {
      res.status(400);
      res.json({
        "status": 400,
        "message": "Token Expired"
      });
      return;
    }

    console.log("access_token valid!");
    
    usersController.userExists(decoded.user.username, function(err, result){
      if(err || result.length == 0){
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid user"
        });
      }
      else {
        console.log('request authenticated!');
        next();
      }
    });
  }
  else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid token or username"
    });
  }
}
