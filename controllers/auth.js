var jwt = require('jwt-simple');
var config = require('../web.config');
var usersController = require('./users');

// POST http://host/login
// HEADERS: Content-Type: application/json
// BODY { "username": "myUsername", "password": "myPassword"}
module.exports.login = function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username == '' || password == '') {
    res.status(401);
    res.json({ "status": 401, "message": "Invalid credentials" });
    return;
  }

  usersController.validateUser(username, password, function(err, result){
    if (err || result == null || result.length == 0) {
      res.status(401);
      res.json({ "status": 401, "message": "Invalid credentials" });
      return;
    }

    var user = { 
      "username": result[0].username
    };
    
    var token = genToken(user);
    res.json(token);
  });
};

// POST http://host/signup
// HEADERS: Content-Type: application/json
// BODY { "username": "myuser", "password": "mypass" }
module.exports.signup = function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username == '' || password == '') {
    res.status(500);
    res.json({ "status": 500, "message": "Please provide valid credentials" });
    return;
  }
  
  usersController.userExists(username, function(err, result){
    if(result.length > 0) {
      res.status(500);
      res.json({ "status": 500, "message": "user already exists" });
      return;
    } else {
      usersController.createUser(req, res, function(creationError){
        if(creationError) {
          res.status(500);
          res.json({ "status": 500, "message": creationError });
        } else {
          var user = { 
            "username": username
          };
          
          var token = genToken(user);
          res.json(token);
        }
      });      
    }
  });
};

// private method
function genToken(user) {
  var expires = expiresIn(1);
  var token = jwt.encode({ "exp": expires, "user": user }, config.SECRET);

  return { "token": token };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
