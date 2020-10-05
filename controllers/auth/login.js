import {AppError, catchAsync} from '../../utils';
import User from '../../models/user';
import {createSendToken} from './utils';

export const login = catchAsync(async (req,res, next)=> {
    const {email, password} = req.body;

    if(!email || !password){
        throw new AppError('Please provide email and password', 401);
    }

    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');
    const correct = user && await user.correctPassword(password, user.password);
    
    if (!user || !correct) {
        return next(new AppError('Incorrect email & password', 401));
    }
    createSendToken(user, 200, req, res);
});