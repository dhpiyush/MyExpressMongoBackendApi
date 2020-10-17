const express = require("express");
const authController = require("../controllers/auth");
const orderController = require("../controllers/order");

const router = express.Router();

/**
 * get a user
 */
// router.get('/:id', test);

/**
 * get a user profile
 */
// router.get('/profile/:id', test);

/**
 * adds a user
 */
// router.post('/add', test)

router.use(authController.protect);
router.post("/create", orderController.createOrder);
router.get("/my/all", orderController.getAllMyOrders);
router.get("/myOrder", orderController.getMyOrder);

router.put(
  "/update",
  orderController.filterUpdateOrderParams,
  orderController.updateOrder
);
module.exports = router;
