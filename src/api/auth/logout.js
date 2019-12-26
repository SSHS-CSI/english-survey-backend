module.exports = async (ctx, next) => {
    ctx.session = null;
    ctx.body.status = "success";
};
