const jwt = require('jsonwebtoken');
genToken = (payload) => {
    token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '1d'
    });
    return token;
}
module.exports = genToken;