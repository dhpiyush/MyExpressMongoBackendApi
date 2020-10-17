import { AppError, catchAsync } from "../../utils";
import Order from "../../models/order";

export const getAllMyOrders = catchAsync(async (req, res, next) => {
  const user = req.user;

  const orders = await Order.find({
    userId: user.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
