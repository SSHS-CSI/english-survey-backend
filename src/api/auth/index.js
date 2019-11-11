const Router = require('koa-router');
const auth = new Router();

auth.post('/register', require("./register"));
//auth.post('/login', require("./login"));

module.exports = auth;