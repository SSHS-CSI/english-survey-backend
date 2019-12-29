const Router = require("koa-router");

const { requireAdmin } = require("../../middleware");

const master = new Router();

master.get("/active", requireAdmin, require("./active"));
master.post("/excel", requireAdmin, require("./excel"));

module.exports = master;
