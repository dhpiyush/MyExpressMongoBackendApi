import { AppError, catchAsync } from "../../utils";
import Order from "../../models/order";

export const getMyOrder = catchAsync(async (req, res, next) => {
  const user = req.user;
  const orderId = req.body.orderId;

  if (!orderId) {
    throw new AppError("Please provide OrderId", 400);
  }

  if (!req.user.orders.includes(orderId)) {
    throw new AppError("OrderId provided does not belong to user", 400);
  }

  const order = await Order.findById(orderId);

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
