var jwt = require('jwt-simple');
var config = require('../web.config');
var usersController = require('./users');

// POST http://host/login
// HEADERS: Content-Type: application/json
// BODY { "username": "myUsername", "password": "myPassword"}
module.exports.login = function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  console.log(username);
  console.log(password);

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

    var token = genToken(result);
    res.json(token);
  });
};

// private method
function genToken(user) {
  var expires = expiresIn(1); // 7 days
  var token = jwt.encode({
    exp: expires
  }, config.SECRET);

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
