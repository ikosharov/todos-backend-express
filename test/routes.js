var assert = require('assert');
var request = require('supertest');
var config = require('../web.config.js');

describe('Routing', function () {
	var url = config.PRODUCTION_URL;

	var credentials = {};

	before(function (done) {
		var randomNumStr = Math.random().toString();
		var randomString = randomNumStr.substr(randomNumStr.indexOf(".") + 1);
		credentials = {
			username: 'user' + randomString,
			password: 'password1'
		}

		done();
	});

	describe('auth controller', function () {
		it('should be able to register users', function (done) {
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

		if ('should be able to sign in', function (done) {
			request(url)
				.post('/login')
				.send(credentials)
				.end(function (err, res) {
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