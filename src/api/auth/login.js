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
        ctx.error(403, "no-such-user");
    }

    let passMatch = await bcrypt.compare(ctx.request.body.password, result.hashedPass);
    if (!passMatch) {
        ctx.error(403, "password-does-not-match");
    }

    let response = {
        data: [],
        pageNum: 0
    };

    ctx.session._id = result._id;
    ctx.cookies.set("answer", JSON.stringify(response), {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 24 * 1000
    });

    ctx.body.status = "success";
};
