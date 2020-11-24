import jwt from "jsonwebtoken";
import 'dotenv/config';

const auth = (req, res, next)=> {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,process.env.AUTH_TOKEN);
        const userId = decodedToken.userId;
        
        if ( req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request !')
        });
    }
};

module.exports = auth;