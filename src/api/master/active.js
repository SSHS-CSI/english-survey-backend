module.exports = async (ctx, next) => {
    let result = await ctx.state.collection.account.find()
        .sort({ createdAt: -1 })
        .sort({ type: 1 })
        .toArray();

    if(result === null) {
        ctx.error(404, "no-result");
    }

    ctx.body.data = result.map(data => {
        let processed = {};
        processed.username = data.username;
        processed.type = data.type;
        return processed;
    });
    ctx.body.status = "success";
};
