const { ObjectID } = require("mongodb");

module.exports = async (ctx) => {
    // TODO: Remove duplication by making this middleware
    if (!ctx.session || !ctx.session.id) {
        console.log("[debug]: ctx.session = ", ctx.session);
        console.log("[debug]: ctx.session.isNew = ", ctx.session.isNew);
        ctx.error(401, "unauthorized");
    }

    const updateResult = await ctx.state.collection.account.findOneAndUpdate({
        _id: new ObjectID(ctx.session.id)
    }, {
        $inc: {
            "response.pageNum": -1
        }
    });

    ctx.body.status = "success";
};
