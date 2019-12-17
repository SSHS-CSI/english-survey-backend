module.exports = async (ctx, next) => {
    ctx.cookies.set('access_token', '', {
        httpOnly: true,
        maxAge: -100 * 60 * 60 * 24 * 7
    });
}