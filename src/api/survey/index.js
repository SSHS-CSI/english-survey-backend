const Router = require("koa-router");

const { requireAuth } = require("../../middleware");

const survey = new Router();

survey.get("/response", requireAuth, require("./response-get.js"));
survey.post("/response", requireAuth, require("./response-post.js"));

module.exports = survey;
