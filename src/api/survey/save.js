verifyToken = require("../../lib/verify");

module.exports = async (ctx, next) => {
    if(
        !ctx.request.body ||
        !Array.isArray(ctx.request.body.data)
    ) {
        ctx.error(400, "response-incomplete");
    }
    ctx.request.body.data.forEach((response) => {
        if (!response.left || !response.right) {
            ctx.error(400, "response-incomplete");
        }
    });

    let response = JSON.parse(ctx.cookies.get("answer"));
    if(JSON.stringify(response.data[response.pageNum]) === JSON.stringify(ctx.request.body.data)) {
        ctx.body.status = "success";
    }
    else {
        response.data[response.pageNum] = ctx.request.body.data;

        const _profile = verifyToken(ctx.cookies.get("access_token"));
        profile = {
            username: _profile.username,
            type: _profile.type,
            _id: _profile._id
        };

        const result = await ctx.state.collection.response.findOneAndUpdate({ profile: profile },
            {
                $setOnInsert: {
                    profile: profile,
                },
                $set: {
                    "response": response.data
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
