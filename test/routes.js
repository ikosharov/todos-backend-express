var assert = require('assert');
var request = require('supertest');
var config = require('../web.config.js');
var _ = require('lodash');

describe('Routing', function () {
	var url = config.PRODUCTION_URL;
	//var url = config.DEV_URL;

	var generateRandomString = function () {
		var randomNumStr = Math.random().toString();
		return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
	}

	var commonUser = {
		username: "common" + generateRandomString(),
		password: "commonPassword"
	};

	var commonTodo = {
		title: "my task",
		dueDate: new Date(),
		isDone: false
	};

	before(function (done) {
		// first create a user for which we'll be running the rest of the tests
		request(url)
			.post('/signup')
			.send(commonUser)
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(200, res.status);
				assert(res.body.token);

				request(url)
					.post("/api/todos")
					.set('access_token', res.body.token)
					.send(commonTodo)
					.end(function (err, res) {
						if (err) {
							throw err;
						}
						commonTodo._id = res.body._id;

						// now we're ready to run the tests
						done();
					});
			});
	});

	describe('auth controller', function () {
		it('should be able to register users', function (done) {
			var credentials = {
				username: 'user' + generateRandomString(),
				password: 'password1'
			}

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
							done();
						});
				});
		});

		it('should be able to sign in users', function (done) {
			request(url)
				.post('/login')
				.send(commonUser)
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
							done();
						});
				});
		});

		it('should be able to get todos', function (done) {
			request(url)
				.post('/login')
				.send(commonUser)
				.end(function (err, res) {
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

							var idx = _.findIndex(res.body, function (todo) {
								return todo._id == commonTodo._id;
							});

							assert.ok(idx != -1);
							done();
						});
				});
		});

		it('should be able to create and delete todos', function (done) {
			var todo = {
				title: "temp task",
				dueDate: new Date(),
				isDone: false
			}

			request(url)
				.post('/login')
				.send(commonUser)
				.end(function (err, res) {
					var token = res.body.token;
					request(url)
						.post("/api/todos")
						.send(todo)
						.set('access_token', token)
						.end(function (err, res) {
							if (err) {
								throw err;
							}

							assert.equal(200, res.status);
							assert.ok(res.body._id);
							assert.ok(res.body.title);
							assert.ok(res.body.dueDate);
							assert.ok(res.body.isDone != null);

							request(url)
								.del("/api/todos/" + res.body._id)
								.set('access_token', token)
								.end(function (err, res) {
									if(err) {
										throw err;
									}
									assert.equal(204, res.status);
									done();
								});
						});
				});
		});
	});
});