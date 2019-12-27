const XLSX = require('xlsx');

module.exports = async (ctx, next) => {
    if (!ctx.request.body.username) {
        ctx.error(400, 'form-malformed');
    }

    const result = await ctx.state.collection.account.findOne({ username: ctx.request.body.username });

    if(result === null) {
        ctx.error(403, 'no-such-user');
    }

    let ws = XLSX.utils.json_to_sheet(result.response);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Response_Result");

    XLSX.writeFile(wb, ctx.request.body.username + '.xlsx', { bookType: "xlsx" });

    ctx.body.status = "success";
};
