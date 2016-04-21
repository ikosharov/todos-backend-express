var User = require('../models/user');

// GET http://host/api/users?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
module.exports.getUsers = function(req, res) {
  User.find('username', function(err, results) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(results);
    }
  });
};

// GET http://host/api/users/:username?access_token={token}&username={username}
// HEADERS: Content-Type: application/json
module.exports.getUser = function(req, res) {
  var condition = { username: req.params.username };
  User.findOne(condition, function(err, result) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(result);
    }
  });
};

// POST http://host/api/users
// HEADERS Content-Type: application/json
// BODY {'username': 'myUser', 'password', 'myPassword'}
module.exports.createUser = function(req, res) {
  var condition = { username: req.body.username };
  User.find(condition, function(err, result) {
    if(result.length == 0){
      var entry = new User({
        username: req.body.username,
        password: req.body.password,
        todos: []
      });

      entry.save(function(error) {
        if (error) {
          res.send(error);
        }
        else {
          res.json(entry);
        }
      });
    }
    else {
      // send error
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
