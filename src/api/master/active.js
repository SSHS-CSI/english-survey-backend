module.exports = async (ctx, next) => {
    let result = await ctx.state.collection.account.find({ hasResponsed: true })
        .sort({ type: 1 })
        .toArray();

    if(result === null) {
        ctx.body.status = false;
        ctx.body.error = "no-result";
        ctx.throw(404, JSON.stringify(ctx.body));
    }

    ctx.body = result;
}