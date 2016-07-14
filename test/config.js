if(process.env.NODE_ENV == 'prod') {
	module.exports.API_URL = "http://todos-backend-express-v2.herokuapp.com";
} else {
	module.exports.API_URL = "http://localhost:3000";
}