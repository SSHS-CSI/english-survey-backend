const Router = require("koa-router");
const koaBody = require("koa-body");

const api = Router();
const middleware = require("../middleware");

const auth = require("./auth");
const master = require("./master");
const survey = require("./survey");

api.use(async (ctx, next) => {
    ctx.body = {};
    await next();
});

api.use(koaBody());
api.use(middleware.getDB);

api.use("/auth", auth.routes());
api.use("/master", master.routes());
api.use("/survey", survey.routes());

module.exports = api;
