const Router = require("koa-router");
const survey = new Router();

survey.get("/response", require("./response-get.js"));
survey.post("/response", require("./response-post.js"));

module.exports = survey;
