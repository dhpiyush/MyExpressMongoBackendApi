import { Email, AppError, catchAsync } from "../../utils";
import User from "../../models/user";
import { signToken } from "./utils";

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    throw new AppError("Something is missing", 400);
  }

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  // const url = `${req.protocol}://${req.get('host')/me}`
  // await new Email(newUser, url).sendWelcome();

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});
