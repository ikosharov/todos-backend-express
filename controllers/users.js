var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../web.config');

extractUserData = function(req) {
  var token = req.headers["access_token"];
  var decoded = jwt.decode(token, config.SECRET);
  
  return decoded.user;
}

// GET http://host/api/users
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
module.exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) { res.send(err); }
    else { res.json(users); }
  });
};

// GET http://host/api/users/:username
// HEADERS: Content-Type: application/json
// HEADERS: access_token: {token}
module.exports.getUser = function(req, res) {
  User.findOne({ username: req.params.username }, function(err, result) {
    if (err) { res.send(err); }
    else { res.json(result); }
  });
};

module.exports.createUser = function(req, res, cb) {
  User.find({ username: req.body.username }, function(err, users) {
    if(users.length == 0){
      var entry = new User({
        username: req.body.username,
        password: req.body.password,
        todos: []
      });

      entry.save(function(error) {
        if (error) { cb(error); }
        else { cb(null); }
      });
    }
  });
};

module.exports.validateUser = function(uname, pass, cb) {
  console.log("validate user");
  var condition = { username: uname, password: pass };
  User.find(condition, function(err, result) {
    console.log(result);
    cb(err, result);
  });
};

module.exports.userExists = function(username, cb) {
  console.log("user exists");
  var condition = { username: username };
  User.find(condition, function(err, result) {
    cb(err, result);
  });
};
