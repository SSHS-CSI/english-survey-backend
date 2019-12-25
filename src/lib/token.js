const jwt = require("jsonwebtoken");

genToken = (payload) => jwt.sign(payload, process.env.KEY, {
    expiresIn: "1d"
});

module.exports = genToken;
