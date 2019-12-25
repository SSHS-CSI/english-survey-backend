const jwt = require("jsonwebtoken");

verifyToken = (token) => jwt.verify(token, process.env.JWT_KEY);

module.exports = verifyToken;
