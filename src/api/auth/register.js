const bcrypt = require("bcrypt");

const studentCount = require("../survey/students.js");
const questions = require("../survey/questions.js");

module.exports = async (ctx, next) => {
    if (
        !ctx.request.body.username ||
        !ctx.request.body.type ||
        !ctx.request.body.gender ||
        !ctx.request.body.password
    ) {
        ctx.error(400, "form-malformed");
    }

    if (
        !(
            ctx.request.body.gender === "M" ||
            ctx.request.body.gender === "F"
        )
    ) {
        ctx.error(400, "form-malformed");
    }

    if (
        !(
            ctx.request.body.type === "admin" ||
            ctx.request.body.type === "student" ||
            ctx.request.body.type === "esl" ||
            ctx.request.body.type === "efl"
        )
    ) {
        ctx.error(400, "form-malformed");
    }

    if (
        (ctx.request.body.type == "esl" || ctx.request.body.type == "efl") &&
        !(
            ctx.request.body.years &&
            Number.isInteger(ctx.request.body.years) &&
            ctx.request.body.years >= 0
        )
    ) {
        ctx.error(400, "form-malformed");
    }

    const result = await ctx.state.collection.account.findOneAndUpdate(
        { username: ctx.request.body.username },
        {
            $setOnInsert: {
                username: ctx.request.body.username,
                type: ctx.request.body.type,
                gender: ctx.request.body.gender,
                hashedPass: await bcrypt.hash(
                    ctx.request.body.password,
                    await bcrypt.genSalt(10)
                ),
                response: {
                    data: new Array(studentCount).fill(
                        questions
                            .map(({ type }) => (type === "objective" ? 0 : ""))
                            .map(defaultValue => ({
                                left: defaultValue,
                                right: defaultValue
                            }))
                    ),
                    pageNum: 0
                },
                createdAt: new Date()
            }
        },
        { upsert: true }
    );

    if (result.value) {
        ctx.error(403, "user-exists");
    }

    ctx.body.status = "success";
};
