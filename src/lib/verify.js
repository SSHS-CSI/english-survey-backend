const jwt = require("jsonwebtoken");

verifyToken = (token) => jwt.verify(token, process.env.KEY);

module.exports = verifyToken;
