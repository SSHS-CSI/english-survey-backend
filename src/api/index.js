const { HttpError } = require("koa");

const Router = require("koa-router");
const koaBody = require("koa-body");

const api = Router();
const middleware = require("../middleware");

const auth = require("./auth");
const master = require("./master");
const survey = require("./survey");

api.use(async (ctx, next) => {
    ctx.body = {};
    ctx.error = (code, error) => {
        ctx.body.status = false;
        ctx.body.error = error;
        ctx.throw(code, JSON.stringify(ctx.body));
    };
    try {
        await next();
    } catch(e) {
        if(!(e instanceof HttpError)) { throw e; }
    }
});

api.use(koaBody());
api.use(middleware.getDB);

api.use("/auth", auth.routes());
api.use("/master", master.routes());
api.use("/survey", survey.routes());

module.exports = api;
