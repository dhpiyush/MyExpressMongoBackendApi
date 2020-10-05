import {Email, AppError, catchAsync} from '../../utils';
import User from '../../models/user';
import {signToken} from './utils';

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    // const url = `${req.protocol}://${req.get('host')/me}`
    // await new Email(newUser, url).sendWelcome();

    const token = signToken(newUser._id);
    
    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            }
        }
    });
});