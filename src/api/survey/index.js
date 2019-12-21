const Router = require('koa-router');
const survey = new Router();

survey.post('/save', require("./save"));

module.exports = survey;