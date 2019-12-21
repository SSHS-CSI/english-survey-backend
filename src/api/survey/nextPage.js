module.exports = () => {
    response = ctx.cookies.get('answer');
    response.pageNum++;
    ctx.cookies.set('answer', response, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 24 * 1000
    });
}