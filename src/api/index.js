const Router = require('koa-router');
const koaBody = require('koa-body');

const api = Router();
const middleware = require('../middleware');

const auth = require('./auth');
const master = require('./master');

api.use(async (ctx, next) => {
    ctx.body = {};
    await next();
});

api.use(koaBody());
api.use(middleware.getDB);

api.use('/auth', auth.routes());
api.use('/master', master.routes());

module.exports = api;