import { AppError, catchAsync } from "../../utils";
import factory from "../handler-factory";
import User from "../../models/user";
import { filterObj } from "../utils";

export const updateMe = catchAsync(async (req, res, next) => {
  //1. create error if user tries to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "The route is not for password updates. Please use /updatePassword"
      ),
      400
    );
  }

  // 2. filter fields
  req.body = filterObj(req.body, "name", "email"); //filter the objects that we need to update
  req.params.id = req.user.id;
  next();
});

//DO NOT update PASSWORD with this
export const updateUser = factory.updateOne(User, ["name", "email"]);
