module.exports = async (ctx, next) => {
    let result = await ctx.state.collection.account.find({ hasResponsed: false })
        .sort({ createdAt: -1 })
        .sort({ type: 1 })
        .toArray();

    if(result === null) {
        ctx.body.status = false;
        ctx.body.error = "no-result";
        ctx.throw(404, JSON.stringify(ctx.body));
    }

    ctx.body = result.map(data => {
        let processed = {};
        processed.username = data.username;
        processed.password = data.password;
        processed.type = data.type;
        return processed;
    });
}