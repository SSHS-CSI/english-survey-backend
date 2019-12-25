const verifyToken = require("../../lib/verify");

module.exports = async (ctx, next) => {
    if(
        !ctx.request.body ||
        !Array.isArray(ctx.request.body.data)
    ) {
        ctx.error(400, "form-malformed");
    }
    ctx.request.body.data.forEach((response) => {
        if (!response.left || !response.right) {
            ctx.error(400, "form-malformed");
        }
    });

    let response = JSON.parse(ctx.cookies.get("answer"));
    if(JSON.stringify(response.data[response.pageNum]) === JSON.stringify(ctx.request.body.data)) {
        ctx.body.status = "success";
    }
    else {
        response.data[response.pageNum] = ctx.request.body.data;

        const { _id } = ctx.session;
        profile = { _id };

        const result = await ctx.state.collection.response.findOneAndUpdate({ profileId: _id },
            {
                $setOnInsert: {
                    profileId: _id,
                },
                $set: {
                    response: response.data
                }
            },
            { upsert: true });


        ctx.cookies.set("answer", JSON.stringify(response), {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 24 * 1000
        });

        ctx.body.status = "success";
    }
};
