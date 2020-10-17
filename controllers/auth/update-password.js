import { AppError, catchAsync } from "../../utils";
import User from "../../models/user";
import { createSendToken } from "./utils";

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  if (!currentPassword) {
    throw new AppError("Please provide current password", 400);
  }

  if (!password || !confirmPassword) {
    return next(
      new AppError("Please provide password and confirm passowrd", 400)
    );
  }

  console.log("updatePassword", req.user.id);
  //1. get the user from collection
  // the request will come from logged in user, i.e from protect middleware so we will have id
  const user = await User.findOne({ _id: req.user.id }).select("+password");
  console.log("user", user);

  //2. check if posted current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  //3. if so update password
  user.password = password;
  user.confirmPassword = confirmPassword; // the validator will automatically validate passwords
  await user.save();
  //user.findByIdAndUpdate will not work as intended! middlewares as well as validators wont work

  //4. log user in, send JWT
  createSendToken(user, 200, req, res);
});
