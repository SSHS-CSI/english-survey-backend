const Router = require("koa-router");

const { requireAuth } = require("../../middleware");

const auth = new Router();

auth.post("/register", require("./register"));
auth.post("/login", require("./login"));
auth.post("/logout", require("./logout"));
auth.get("/check", requireAuth, require("./check"));

module.exports = auth;
