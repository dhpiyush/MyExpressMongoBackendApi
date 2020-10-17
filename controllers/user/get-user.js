import { catchAsync } from "../../utils";

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  user._id = null;
  user.role = null;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
