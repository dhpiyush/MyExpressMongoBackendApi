const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const user = require("./user");
const order = require("./order");

router.post("/v1/login", authController.login);
router.post("/v1/signup", authController.signup);
router.post("/v1/forgotPassword", authController.forgotPassword); //only receive email address
router.use("/v1/user", user);
router.use("/v1/order", order);

// Protect all routes after this middleware
router.use(authController.protect); // this is a middleware, so that after this all the routes are protected(authenticated)
router.post("/v1/logout", authController.logout);

module.exports = router;
