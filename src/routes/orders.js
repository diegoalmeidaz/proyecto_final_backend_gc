// routes/orders.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check } = require("express-validator");
const {
  getOrderById,
  createOrder,
  deleteOrder,
  getOrdersByAdmin,
  updateOrderStatus,
  updateOrder,
} = require("../controllers/orderController");

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso no autorizado" });
  }
};

router.get(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  getOrderById
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    check("user_id").notEmpty(),
    check("total_price").notEmpty(),
    check("status_order").notEmpty(),
  ],
  createOrder
);

router.delete(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteOrder
);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrdersByAdmin
);

router.put(
  "/status/:order_id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateOrderStatus
);

// Ruta para actualizar una orden
router.put(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);

module.exports = router;
