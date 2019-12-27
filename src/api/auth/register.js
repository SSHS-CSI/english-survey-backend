const bcrypt = require("bcrypt");

const studentCount = require("../survey/students.js");
const questions = require("../survey/questions.js");

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
                hashedPass: await bcrypt.hash(ctx.request.body.password, await bcrypt.genSalt(10)),
                response: {
                    data: new Array(studentCount).fill(questions.map(({ type }) => (type === "objective" ? 0 : "")).map(defaultValue => ({
                        left: defaultValue,
                        right: defaultValue
                    }))),
                    pageNum: 0
                },
                createdAt: new Date()
            }
        },
        { upsert: true });

    if (result.value) {
        ctx.error(403, "user-exists");
    }

    ctx.body.status = "success";
};
