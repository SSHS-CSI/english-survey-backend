const Router = require('koa-router');
const koaBody = require('koa-body');

const api = new Router();
const auth = require('./auth');
const middleware = require('../middleware');

api.use(async (ctx, next) => {
    ctx.body = {};
    await next();
});

api.use(middleware.getDB);
api.use(koaBody());

api.use('/auth', auth.routes());

module.exports = api;