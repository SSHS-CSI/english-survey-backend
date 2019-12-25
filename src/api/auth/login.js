const genToken = require('../../lib/token');
const bcrypt = require("bcrypt");

module.exports = async (ctx, next) => {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.password
    ) {
        ctx.error(400, "form-malformed");
    }

    const result = await ctx.state.collection.account.findOne({ username: ctx.request.body.username });

    if (!result) {
        ctx.error(400, "no-such-user");
    }

    let passMatch = await bcrypt.compare(ctx.request.body.password, result.hashedPass);
    if (!passMatch) {
        ctx.error(400, "password-does-not-match");
    }

    if (result.hasResponsed) {
        ctx.error(400, "already-responsed");
    }

    const profile = {};
    profile.username = result.username;
    profile.type = result.type;
    profile._id = result._id;
    let token = genToken(profile);

    let response = {
        data: [],
        pageNum: 0
    };
    ctx.cookies.set("access_token", token, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 24 * 1000 
    });
    ctx.cookies.set("answer", JSON.stringify(response), {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 24 * 1000
    });

    ctx.body.status = "success";
};
