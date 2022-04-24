import { getIndiaDateTime } from "../../utils";
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    description: String,
    price: {
        beforeDiscount: Number,
        afterDiscount: Number
    }
  quantity:{
      available: Number,
      total: Number
  },
  image: {
      url: String
  },
  category:{
    name: {
        type: String,
        num: ["electronics", "grocery", "sports"],
        default: "grocery",
    },
    description: String
  },
  isAvailable: {
      type: Boolean
      default: true
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Product must belong to a seller"],
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

const Product = mongoose.model("Product", productSchema); //name of the model and the schema

export default Product;
