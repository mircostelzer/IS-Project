import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;

export const tokenChecker = function(req, res, next) {
    var token;
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else {
        token = req.body.token || req.headers['x-access-token'] || req.query.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Token not found"});
    }

    verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).json({ success: false, message: "Failed to authenticate the token"});
        }

        req.user = decoded;
        next();
    });
}

export const verifyRole = function(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).json({ success: false, message: "Access denied"});
        }
        next();
    };
}
