const { ObjectID } = require("mongodb");

module.exports = async (ctx, next) => {
    const user = await ctx.state.collection.account.findOne({
        _id: new ObjectID(ctx.session.id)
    });

    ctx.body.type = user.type;
    ctx.body.status = "success";
};
