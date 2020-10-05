import jwt from 'jsonwebtoken';
import config from 'config';

const JWT_SECRET = config.get('jwt-token');
const JWT_EXPIRES_IN = config.get('jwt-expires-in');
const JWT_COOKIE_EXPIRES = config.get('jwt-cookie-expires');

export const signToken = id => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

export const createSendToken = (user, statusCode, req, res) =>{
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRES*24*60*60*1000),
        httpOnly: true, // cookie cannot be modified by client
        // secure: req.secure || req.headers('x-forwaded-proto') === 'https' //heroku sets header in this way for secure connection
        secure: req.secure
        // need to set app.enable('trust proxy) inorder to get this header
    };
    
    //sent over to client and automatically added to browser and sent over any call later
    res.cookie('jwt', token, cookieOptions);

    //remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    });
};