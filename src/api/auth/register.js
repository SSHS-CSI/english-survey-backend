const bcrypt = require("bcrypt");

module.exports = async (ctx, next) => {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.type ||
        !ctx.request.body.password
    ) {
        ctx.error(400, "form-malformed");
    }

    const result = await ctx.state.collection.account.findOneAndUpdate({ username: ctx.request.body.username },
        {
            $setOnInsert: {
                username: ctx.request.body.username,
                type: ctx.request.body.type,
                hasResponsed: false,
                password: ctx.request.body.password,
                hashedPass: await bcrypt.hash(ctx.request.body.password,
                    await bcrypt.genSalt(10)),
                createdAt: new Date()
            }
        },
        { upsert: true });

    if (result.value) {
        ctx.error(400, "user-exists");
    }

    ctx.body.status = "success";
};
