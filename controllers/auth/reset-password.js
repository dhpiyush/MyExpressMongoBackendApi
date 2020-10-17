import { AppError, catchAsync } from "../../utils";
import User from "../../models/user";
import { createSendToken } from "./utils";
const crypto = require("crypto");

export const resetPassword = catchAsync(async (req, res, next) => {
  console.log("resetPassword");
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(
      new AppError("Please provide password and confirm passowrd", 400)
    );
  }
  //1. get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. if user has not expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3. update changePasswordAt property for the user

  //4. log the user in, send JWT
  createSendToken(user, 200, req, res);
});
