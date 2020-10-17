const mongoose = require("mongoose");
import { getIndiaDateTime } from "../../utils";
// const validator = require('validator');

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    num: ["created", "unpaid", "paid", "cancelled", "delivered", "closed"],
    default: "created",
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
  products: [
    {
      description: String,
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product must belong to the products list"],
      },
      price: {
        beforeDiscount: Number,
        afterDiscount: Number,
      },
      updatedAt: {
        type: Date,
        default: getIndiaDateTime(),
        select: false,
      },
      quantity: {
        totalUnits: Number,
      },
    },
  ],
  total: {
    priceBeforeDiscount: Number,
    priceAfterDiscount: Number,
    price: Number,
    returns: Number,
  },
  coupons: [
    {
      id: String,
      name: String,
      description: String,
    },
  ],
  isActive: Boolean,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: getIndiaDateTime(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: getIndiaDateTime(),
  },
});

// orderSchema.pre("findByIdAndUpdate", function (next) {
//   this.updatedAt = new Date();
//   console.log("this.updatedAt", this.updatedAt);
//   next();
// });

const Order = mongoose.model("Order", orderSchema); //name of the model and the schema

export default Order;
