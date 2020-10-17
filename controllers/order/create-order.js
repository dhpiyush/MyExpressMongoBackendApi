import { AppError, catchAsync } from "../../utils";
import Order from "../../models/order";

export const createOrder = catchAsync(async (req, res, next) => {
  const user = req.user;

  const newOrder = await Order.create({
    isActive: true,
    products: {
      name: "Apple",
    },
    userId: user.id,
  });

  user.orders.push(newOrder.id);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    data: {
      order: newOrder,
    },
  });
});
