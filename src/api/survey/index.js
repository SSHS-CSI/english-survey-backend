const Router = require("koa-router");

const { requireAuth } = require("../../middleware");

const survey = new Router();

survey.get("/response", requireAuth, require("./response-get.js"));
survey.post("/response", requireAuth, require("./response-post.js"));
survey.get("/student-count", async (ctx) => {
    ctx.body.data = require("./students.js");
    ctx.body.status = "success";
});

module.exports = survey;
