const jwt = require('jsonwebtoken');

const tokenChecker = function(req, res, next) {

    var token = req.body.token || req.header['x-access-token'] || req.query.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Token not found"});
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).json({ success: false, message: "Failed to authenticate the token"});
        }

        req.user = decoded;
        next();
    });
}

const verifyRole = function(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).json({ success: false, message: "Access denied"});
        }
        next();
    };
}

module.exports = { tokenChecker, verifyRole };