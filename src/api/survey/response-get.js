const { ObjectID } = require("mongodb");

const questions = require("./questions.js");

module.exports = async (ctx, next) => {
    const account = await ctx.state.collection.account.findOne({
        _id: new ObjectID(ctx.session.id)
    });

    // _id should exist already
    // something got wrong
    if(account === null) {
        ctx.error(500, "internal-server-error");
    }

    ctx.body.data = account.response;
    ctx.body.status = "success";
};
