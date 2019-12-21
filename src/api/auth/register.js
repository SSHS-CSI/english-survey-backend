const bcrypt = require('bcrypt');
const genToken = require('../../lib/token');

module.exports = async (ctx, next) => {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.type ||
        !ctx.request.body.password
    ) {
        ctx.body.status = false;
        ctx.body.error = "form-malformed";
        ctx.throw(400, JSON.stringify(ctx.body));
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
        ctx.body.status = false;
        ctx.body.error = "user-exists";
        ctx.throw(400, JSON.stringify(ctx.body));
    }

    ctx.body.status = "success";
};