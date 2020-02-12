const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
        res.status(401).json({ msg: "No x-auth token, authorization denied!" });
    }

    try {
        const decodedToken = jwt.verify(token, config.get("jwtSecret"));
        req.user = decodedToken.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
}