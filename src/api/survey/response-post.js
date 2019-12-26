const { ObjectID } = require("mongodb");

const questions = require("./questions.js");

module.exports = async (ctx, next) => {
    // cannot check student count here
    // should error on `ctx.request.body.pageNum >= students.length`
    if(
        !ctx.request.body ||
        !Array.isArray(ctx.request.body.data) ||
        !ctx.request.body.data.length === questions.length ||
        !Number.isInteger(ctx.request.body.pageNum) ||
        ctx.request.body.pageNum < 0
    ) {
        ctx.error(400, "form-malformed");
    }

    ctx.request.body.data.forEach((response) => {
        if (!response.left || !response.right) {
            ctx.error(400, "form-malformed");
        }
    });

    if (!ctx.session || !ctx.session.id) {
        console.log("[debug]: ctx.session = ", ctx.session);
        console.log("[debug]: ctx.session.isNew = ", ctx.session.isNew);
        ctx.error(401, "unauthorized");
    }

    // should check whether update is successful
    // does ctx.request.body.pageNum exist in response.data?
    const updateResult = await ctx.state.collection.account.findOneAndUpdate({
        _id: new ObjectID(ctx.session.id),
        [`response.data.${ctx.request.body.pageNum}`]: { $exists: true }
    }, {
        $set: {
            [`response.data.${ctx.request.body.pageNum}`]: ctx.request.body.data
        }
    });

    // if there is no value, the query's pageNum is non-existent
    if(updateResult.value === null) {
        console.log("[debug]: ctx.request.body.pageNum = ", ctx.request.body.pageNum);
        console.log("[debug]: updateResult = ", updateResult);
        ctx.error(400, "form-malformed");
    }

    ctx.body.status = "success";
};
