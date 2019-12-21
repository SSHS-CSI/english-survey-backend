const jwt = require('jsonwebtoken');
verifyToken = (token) => {
    let profile = null;
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) throw err;
        profile = decoded;
    });
    return profile;
}

module.exports = verifyToken;