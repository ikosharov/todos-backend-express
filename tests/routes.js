var assert = require('assert');
var request = require('supertest');
var config = require('../web.config.js');

describe('Routing', function () {
	var url = 'http://todos-backend-express-v2.herokuapp.com';

	var randomString = function () {
		var str = Math.random().toString();
		return str.substr(str.indexOf(".") + 1);
	}

	before(function (done) {
		// setup code goes here						
		done();
	});

	describe('auth controller', function () {
		it('should be able to register users', function (done) {
			var credentials = {
				username: 'user' + randomString(),
				password: 'password1'
			};

			request(url)
				.post('/signup')
				.send(credentials)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					assert.equal(200, res.status);
					assert(res.body.token);

					request(url)
						.get("/api/todos")
						.set('access_token', res.body.token)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								throw err;
							}
							
							assert.equal(200, res.status);
							assert.equal(true, Array.isArray(res.body));
							done();
						});
				});
		});
	});
});