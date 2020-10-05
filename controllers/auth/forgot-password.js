import {AppError, catchAsync} from '../../utils';
import User from '../../models/user';
import {createSendToken} from './utils';

export const forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on posted email
    const email = req.body.email;
    if (!email) {
        return next(new AppError('Please provide email id', 400))
    }

    const user = await User.findOne({email});
    if(!user){
        return next(new AppError('There is no user', 404))
    }
    
    try {
        //generate random token not jwt
        const resetToken = user.createPasswordResetToken();

        //send it to users email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;

        // const message = `Forgot your Password? Submit new password to: ${resetUrl}.\n If you didn't forget your password
        // please ignore this mail!  `

        
        // await sendMail({
        //     email: user.email,
        //     subject: 'Your password reset link is valid for 10mins only',
        //     message
        // });
        // await new Email(user, resetUrl).sendPasswordReset();
            
        user.save({validateBeforeSave: false}); // will make all validators to not run 

        res.status(200).json({
            status: 'success',
            message: 'Reset Password Link sent to mail!',
            resetUrl
        });
    } catch (error) {
        console.log('error');
        // expire reset token
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('There was an error sending the mail. Try again later!', 500))
    }
});