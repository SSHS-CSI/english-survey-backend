const Router = require("koa-router");
const master = new Router();

master.get("/active", require("./active"));
master.post("/excel", require("./excel"));

module.exports = master;
