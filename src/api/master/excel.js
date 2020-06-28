const XLSX = require('xlsx');

module.exports = async (ctx, next) => {
    if (
        !Number.isInteger(ctx.request.body.type) ||
        (1 < ctx.request.body.type || ctx.request.body.type < 0)
    ) {
        ctx.error(400, 'form-malformed');
    }

    let wb = XLSX.utils.book_new();
    let type = ctx.request.body.type; 
    let outFile = null;

    if (type === 0) {
        if(!ctx.request.body.username) {
            ctx.error(400, 'form-malformed');
        }
        let username = ctx.request.body.username || ctx.query.username;

        const result = await ctx.state.collection.account.findOne({ username: username });
        if (result === null) {
            ctx.error(403, 'no-such-user');
        }
        result.response.data.forEach((student) => {
            student.forEach((question) => {
                if (question.left === undefined || !question.right === undefined) {
                    ctx.error(400, "form-malformed");
                }
            });
        });

        ws = getWS1(result.response.data);
        console.log(ws)
        XLSX.utils.book_append_sheet(wb, ws, username);
        outFile = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    } else if (type === 1) {
        const result = await ctx.state.collection.account.find().toArray();

        let NS = getWS2(result.filter(data => data.type === 'efl'));
        let NNS = getWS2(result.filter(data => data.type === 'esl'));
        let Peer = getWS2(result.filter(data => data.type === 'student'));

        XLSX.utils.book_append_sheet(wb, NS, "NS");
        XLSX.utils.book_append_sheet(wb, NNS, "NNS");
        XLSX.utils.book_append_sheet(wb, Peer, "Peer");
        outFile = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    }

    ctx.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ctx.body = new Buffer(outFile, 'base64');
}

let getWS1 = result => {
    let ws = {};
    result.forEach((student, idx1) => {
        let cellChar = 4 * (idx1 % 5) + 1;
        let cellNum = Math.floor(idx1 / 5) * (result[0].length + 1) + 1;
        ws[toExcelChar(cellChar) + cellNum] = { t: 's', v: idx1 + 1 };
        ws[toExcelChar(cellChar + 1) + cellNum] = { t: 's', v: '전' };
        ws[toExcelChar(cellChar + 2) + cellNum] = { t: 's', v: '후' };
        student.forEach((question, idx2) => {
            let type = (typeof (question.left) === 'string') ? 's' : 'n';
            ws[toExcelChar(cellChar + 1) + (cellNum + idx2 + 1)] = { t: type, v: question.left };
            ws[toExcelChar(cellChar + 2) + (cellNum + idx2 + 1)] = { t: type, v: question.right };
        })
    })
    ws['!ref'] = 'A1:S1000'

    return ws;
}

let getWS2 = result => {
    let ws = {};
    ws['!merges'] = []
    result.forEach((survey, idx1) => {
        ws['A' + (idx1 + 1) * 2] = { t: 's', v: survey.username };
        survey.response.data.forEach((student, idx2) => {
            let cellNum = 2 * (idx1 + 1);
            student.forEach((question, idx3) => {
                let type = (typeof(question.left) === 'string') ? 's' : 'n';
                ws[toExcelChar(2 * idx2 + 2) + (cellNum + idx3)] = { t: type, v: question.left };
                ws[toExcelChar(2 * idx2 + 3) + (cellNum + idx3)] = { t: type, v: question.right };
            })
        })
    })
    for (let i = 0; i < result[0].response.data.length; i++) {
        ws[toExcelChar((i + 1) * 2) + 1] = { t: 's', v: 'S' + (i + 1) };
        console.log(toExcelChar((i + 1) * 2) + 1)
        ws['!merges'].push({ s: { r: 0, c: i * 2 + 1 }, e: { r: 0, c: i * 2 + 2 } });
    }
    ws['!ref'] = 'A1:ZZ1000'

    return ws;
}

let toExcelChar = num => {
    let his = [];
    while (num > 0) {
        his.push(65 + (num - 1) % 26);
        num = Math.floor((num - 1) / 26);
    }
    his.reverse()

    let str = '';
    his.forEach(charCode => {
        str += String.fromCharCode(charCode);
    })

    return str;
}