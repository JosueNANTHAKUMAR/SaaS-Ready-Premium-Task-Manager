const jwt = require('jsonwebtoken')

module.exports  = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, id) => {
        if (err) {
            return res.sendStatus(401)
        }
        req.id = id;
        next();
    });
}
