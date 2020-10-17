import { AppError, catchAsync } from "../../utils";
import factory from "../handler-factory";
import Order from "../../models/order";
import { filterObj, toTimeZone } from "../utils";
import moment from "moment-timezone";
import { getIndiaDateTime } from "../../utils";

export const filterUpdateOrderParams = catchAsync(async (req, res, next) => {
  //1. Check if orderId provided is for the given user
  const orderId = req.body.orderId;
  if (!orderId) {
    throw new AppError("Please provide OrderId", 400);
  }

  if (!req.user.orders.includes(orderId)) {
    throw new AppError("OrderId provided does not belong to user", 400);
  }
  // 2. filter fields
  req.body = filterObj(
    req.body,
    "status",
    "discount",
    "isActive",
    "totalProducts"
  ); //filter the objects that we need to update
  req.params.id = orderId;
  req.body.updatedAt = getIndiaDateTime(); //this is UTC time

  next();
});

//DO NOT update PASSWORD with this
export const updateOrder = factory.updateOne(Order, [], "order");
