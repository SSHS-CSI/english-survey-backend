const Joi = require("@hapi/joi");
const Account = require("./account");

module.exports = async (ctx, next) => {
    const schema = Joi.object({
        profile: {
            userName: Joi.string().alphanum().min(5).max(15).required(),
            type: Joi.number().min(1).max(3)
        },
        hasResponsed: Joi.boolean().required(),
        password: Joi.string().min(5).max(15).required(),
        hashedPassword: Joi.string().required()
    });

    const result = schema.validate(ctx.request.body);

    if(result.error) {
        ctx.body = "register-form-invalid";
        ctx.status = 400;
        return;
    }

    let existing = null;
    try {
        existing = Account.findUserName(ctx.request.body.profile.userName);
    }
    catch (error) {
        ctx.throw(500, error);
    }

    if(existing) {
        ctx.status = 409;
        ctx.body = "username-already-exists";
        return;
    }

    let account = null;
    try {
        account = await Account.register(ctx.request.body.profile.userName, ctx.request.body.type);
    }
    catch (error) {
        ctx.throw(500, error);
    }

    ctx.body = "success";
}