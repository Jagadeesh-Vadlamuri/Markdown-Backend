const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = async(req, res, next) => {
    const token =  await req.header('x-auth-token');

    if(!token) {
        res.status(401).json({
            errors: [
                {
                    msg: 'Token not found'
                }
            ]
        })
    }

    // Authenticate
    try{
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user.email;
        next();
    } catch(error) {
        res.status(403).json({
            errors: [
                {
                    msg: 'Invalid Or Expired access token'
                }
            ]
        })
    }
}

module.exports = authToken;