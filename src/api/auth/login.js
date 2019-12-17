const bcrypt = require('bcrypt');

module.exports = async (ctx, next) => {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.password
    ) {
        ctx.body.status = false;
        ctx.body.error = "form-malformed";
        ctx.throw(400, JSON.stringify(ctx.body));
    }

    const result = await ctx.state.collection.account.findOne({ username: ctx.request.body.username });

    if (!result) {
        ctx.body.status = false;
        ctx.body.error = "no-such-user";
        ctx.throw(400, JSON.stringify(ctx.body));
    }

    let passMatch = bcrypt.compareSync(ctx.request.body.password, result.hashedPass);
    if (!passMatch) {
        ctx.body.status = false;
        ctx.body.error = "password-does-not-match";
        ctx.throw(400, JSON.stringify(ctx.body));
    }

    const profile = {};
    profile.username = result.username;
    profile.type = result.type;
    profile._id = result._id;
    let token = genToken(profile);

    ctx.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 24 * 7
    });

    ctx.body.status = "success";
};