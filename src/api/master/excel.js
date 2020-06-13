const XLSX = require('xlsx');
const FileSaver = require('file-saver');

module.exports = async (ctx, next) => {
    if (!ctx.request.body.username) {
        ctx.error(400, 'form-malformed');
    }

    const result = await ctx.state.collection.account.findOne({ username: ctx.request.body.username });

    if(result === null) {
        ctx.error(403, 'no-such-user');
    }
    result.response.data.forEach((student) => {
        student.forEach((question) => {
            if (question.left === undefined || !question.right === undefined) {
                ctx.error(400, "form-malformed");
            }
        })
    });

    let ws = {}, length = result.response.data[0].length;
    let ind = 0;
    result.response.data.forEach((student) => {
        ind++;
        let cellChar = 65 + 4 * ((ind - 1) % 5);
        let cellNum = Math.floor((ind - 1) / 5) * (length + 2) + 1; 
        ws[String.fromCharCode(cellChar) + cellNum] = { t: 's', v: ind };
        ws[String.fromCharCode(cellChar + 1) + cellNum] = { t: 's', v: '전' };
        ws[String.fromCharCode(cellChar + 2) + cellNum] = { t: 's', v: '후' };
        let ind2 = 0;
        student.forEach((question) => {
            ind2++;
            let type = (typeof(question.left) === 'string')? 's' : 'n';
            ws[String.fromCharCode(cellChar + 1) + (cellNum + ind2)] = { t: type, v: question.left };
            ws[String.fromCharCode(cellChar + 2) + (cellNum + ind2)] = { t: type, v: question.right };
        })
    })
    ws['!ref'] = 'A1:S' + Math.floor(result.response.data.length / 5) * (length + 1) + 1; 
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Response_Result");

    //XLSX.writeFile(wb, 'test.xlsx');
    let outFile = XLSX.write(wb, {bookType: 'xlsx', type:'base64'});

    ctx.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ctx.body = new Buffer(outFile, 'base64');
}

s2ab = s => { 
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}