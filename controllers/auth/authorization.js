"use strict";
import jwt from "jsonwebtoken";
import config from "config";

import { AppError, catchAsync } from "../../utils";
import User from "../../models/user";
const JWT_SECRET = config.get("jwt-token");

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    console.log("cookies", req.cookies.jwt);
    token = req.cookies.jwt;
  }
  console.log("token", token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login in to get access", 401)
    );
  }

  // const decoded = await promisify(jwt.verify)(token, JWT_SECRET); promisify??
  const decoded = await jwt.verify(token, JWT_SECRET);
  console.log("decoded", decoded);

  //check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 404)
    );
  }

  // check if the user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 400)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  console.log("freshUser", freshUser);
  next();
});

export const restrictTo = (...roles) => {
  //roles are ['admin', 'lead']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You dont have permission to perform this action", 403)
      );
    }
    next();
  };
};
