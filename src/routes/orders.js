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
  getOrders,
  getOrdersByUser,
  getOrdersWithDetails,
  createOrderWithDetails, 
  getOrderDetails,
  testOrderDetails, 
  getOrderDetailsById
} = require("../controllers/orderController");

const isAdmin = (req, res, next) => {
  // console.log('Checking if user is admin'); 
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso no autorizado" });
  }
};


router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrdersByAdmin
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrders
);

router.get(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  getOrderById
);

router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  getOrdersByUser
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



router.get(
  "/details",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrdersWithDetails
);

router.get("/test-order-details", testOrderDetails);





router.post(
  "/with-details",
  passport.authenticate("jwt", { session: false }),
  [
    check("order.user_id").notEmpty(),
    check("order.total_price").notEmpty(),
    check("order.status_order").notEmpty(),
    check("orderDetails").isArray({ min: 1 }),
  ],
  createOrderWithDetails
);


router.get(
  "/details/all",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrderDetails
);

router.get(
  "/details/:order_id",
  passport.authenticate("jwt", { session: false }),
  getOrderDetailsById
);












module.exports = router;