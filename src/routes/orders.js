const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth-middleware"); // Cambia 'ensureAuthenticated' a 'userAuth'
const {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrders,
    getOrderById,
} = require("../controllers/orderController");

router.post("/orders", userAuth, createOrder); // Cambia 'ensureAuthenticated' a 'userAuth'

router.put("/orders/:order_id", userAuth, updateOrder); // Cambia 'ensureAuthenticated' a 'userAuth'
router.delete("/orders/:order_id", userAuth, deleteOrder); // Cambia 'ensureAuthenticated' a 'userAuth'
router.get("/orders", userAuth, getOrders); // Cambia 'ensureAuthenticated' a 'userAuth'
router.get("/orders/:order_id", userAuth, getOrderById); // Cambia 'ensureAuthenticated' a 'userAuth'

module.exports = router;
