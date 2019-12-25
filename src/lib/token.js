const jwt = require("jsonwebtoken");

genToken = (payload) => jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1d"
});

module.exports = genToken;
