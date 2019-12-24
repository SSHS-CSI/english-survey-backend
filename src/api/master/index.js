const Router = require("koa-router");
const master = new Router();

master.get("/active", require("./active"));

module.exports = master;
