var assert = require('assert');
var request = require('supertest');
var config = require('./config.js');
var _ = require('lodash');

describe('Routes', function () {
	var url = config.API_URL;

	// function to generate random usernames
	var generateRandomString = function () {
		var randomNumStr = Math.random().toString();
		return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
	}

	// a shared user between tests
	var sharedUser = {
		username: "common" + generateRandomString(),
		password: "commonPassword"
	};

	// todo for the shared user. It will be created and then reused accross tests
	var todoOfSharedUser = {
		title: "my task",
		dueDate: new Date(),
		isDone: false
	};

	before(function (done) {
		// create the shared user
		request(url)
			.post('/signup')
			.send(sharedUser)
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(200, res.status);
				assert(res.body.token);

				// create the todo of the shared user
				request(url)
					.post("/api/todos")
					.set('access_token', res.body.token)
					.send(todoOfSharedUser)
					.end(function (err, res) {
						if (err) {
							throw err;
						}
						todoOfSharedUser._id = res.body._id;

						// now we're ready to run the tests
						done();
					});
			});
	});

	describe('root route', function () {
		it('should reply with hello message', function (done) {
			request(url)
				.get('/')
				.end(function (err, res) {
					assert.equal(200, res.status);
					assert.equal('hello from todos API', res.text);
					done();
				});
		});
	});

	describe('auth controller', function () {
		it('should be able to register users', function (done) {
			// generate random user
			var credentials = {
				username: 'user' + generateRandomString(),
				password: 'password1'
			}

			// register the user
			request(url)
				.post('/signup')
				.send(credentials)
				.end(function (err, res) {
					if (err) {
						throw err;
					}

					// check you get status 200 and an access token
					assert.equal(200, res.status);
					assert(res.body.token);
					done();
				});
		});

		it('should be able to sign in users', function (done) {
			// sign in the shared user
			request(url)
				.post('/login')
				.send(sharedUser)
				.end(function (err, res) {
					if(err) {
						throw err;
					}

					// make sure you get status 200 and an access token
					assert.equal(200, res.status);
					assert(res.body.token);
					done();
				});
		});
	});

	describe("todos controller", function () {
		it('should be able to get todos', function (done) {
			// sign in the shared user
			request(url)
				.post('/login')
				.send(sharedUser)
				.end(function (err, res) {
					request(url)
						.get("/api/todos")
						.set('access_token', res.body.token)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								throw err;
							}

							// make sure you get status 200 + an array of todos, one of which is the sharedUserTodo
							assert.equal(200, res.status);
							assert.equal(true, Array.isArray(res.body));

							var idx = _.findIndex(res.body, function (todo) {
								return todo._id == todoOfSharedUser._id;
							});
							assert.ok(idx != -1);
							done();
						});
				});
		});

		it('should be able to create and delete todos', function (done) {
			// generate some todo
			var todo = {
				title: "temp task",
				dueDate: new Date(),
				isDone: false
			}

			// sign in the shared user
			request(url)
				.post('/login')
				.send(sharedUser)
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

							// make sure you get status 200 and the todo you just created 
							// make sure it now has _id property
							assert.equal(200, res.status);
							assert.ok(res.body._id);
							assert.ok(res.body.title);
							assert.ok(res.body.dueDate);
							assert.ok(res.body.isDone != null);

							// delete the todo we just created
							request(url)
								.del("/api/todos/" + res.body._id)
								.set('access_token', token)
								.end(function (err, res) {
									if (err) {
										throw err;
									}
									// make sure we get status 204. nothing else is returned
									assert.equal(204, res.status);
									done();
								});
						});
				});
		});

		it('should be able to update todos', function (done) {
			// sign in the shared user
			request(url)
				.post('/login')
				.send(sharedUser)
				.end(function (err, res) {
					var token = res.body.token;
					
					// get all todos
					request(url)
						.get("/api/todos")
						.set('access_token', token)
						.end(function (err, res) {

							// find the sharedUserTodo which we know already exists
							var idx = _.findIndex(res.body, function (todo) {
								return todo._id == todoOfSharedUser._id;
							});

							// modify the todo returned from the server
							var todo = res.body[idx];
							todo.title = "modified";
							todo.isDone = true;

							// send the modified todo back to the server
							request(url)
								.put("/api/todos/" + todo._id)
								.set("access_token", token)
								.end(function (err, res) {
									assert.equal(200, res.status);
									done();
								});
						});
				});
		});
	});
});