var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../web.config');

// POST http://host/login
// HEADERS: Content-Type: application/json
// BODY { "username": "myUsername", "password": "myPassword"}
var login = function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  // check lenght requirements
  if (username.length < 4 || password.length < 4) {
    res.status(401);
    res.json({ "status": 401, "message": "Username and password should be at least 4 characters" });
    return;
  }

  validateCredentials(username, password, function (err, userEntry) {
    if (err || !userEntry) {
      res.status(401);
      res.json({ "status": 401, "message": "username or password incorrect" });
      return;
    }

    var user = { "username": userEntry.username };
    var token = genToken(user);
    res.json(token);
  });
};

// POST http://host/signup
// HEADERS: Content-Type: application/json
// BODY { "username": "myuser", "password": "mypass" }
var signup = function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  // check lenght requirements
  if (username.length < 4 || password.length < 4) {
    res.status(401);
    res.json({ "status": 401, "message": "Username and password should be at least 4 characters" });
    return;
  }

  userExists(username, function (err, userEntry) {
    if (err || userEntry) {
      res.status(401);
      res.json({ "status": 401, "message": "user already exists" });
      return;
    } else {
      createUser(req, res, function (creationError) {
        if (creationError) {
          res.status(500);
          res.json({ "status": 500, "message": creationError });
        } else {
          var user = { "username": username };
          var token = genToken(user);
          res.json(token);
        }
      });
    }
  });
};

var createUser = function (req, res, cb) {
  var userEntry = new User({
    username: req.body.username,
    password: req.body.password,
    todos: []
  });

  userEntry.save(function (error) {
    if (error) { cb(error); }
    else { cb(null); }
  });
};

var validateCredentials = function (username, pass, cb) {
  var condition = { username: username, password: pass };
  User.findOne(condition, function (err, userEntry) {
    cb(err, userEntry);
  });
};

var userExists = function (username, cb) {
  var condition = { username: username };
  User.findOne(condition, function (err, userEntry) {
    cb(err, userEntry);
  });
};

module.exports = {
  login: login,
  signup: signup,
  userExists: userExists
}

// private method
function genToken(user) {
  var dateObj = new Date();
  var expDate = dateObj.setDate(dateObj.getDate() + 1);
  var token = jwt.encode({ "exp": expDate, "user": user }, config.SECRET);

  return { "token": token };
}

extractUserData = function (req) {
  var token = req.headers["access_token"];
  var decoded = jwt.decode(token, config.SECRET);

  return decoded.user;
}

