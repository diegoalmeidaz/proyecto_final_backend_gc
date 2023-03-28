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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operaciones relacionadas con las ordenes.
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Recupera una lista de todas las órdenes
 *     tags: 
 *      - Orders
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error al recuperar las órdenes
 */



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



/**
 * @swagger
 * /orders/{order_id}:
 *   get:
 *     summary: Recupera una orden por su ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error al recuperar la orden
 */




router.get(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  getOrderById
);



/**
 * @swagger
 * /orders/user/{user_id}:
 *   get:
 *     summary: Recupera las órdenes de un usuario por su ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Órdenes encontradas para el usuario especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No se encontraron órdenes para el usuario especificado
 *       500:
 *         description: Error al recuperar las órdenes del usuario
 */


router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  getOrdersByUser
);


/**
 * @swagger
 * /orders:
 *  post:
 *    summary: Crea una nueva orden con sus detalles
 *    tags: [Orders]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *              total_price:
 *                type: number
 *              status_order:
 *                type: string
 *              delivery_address:
 *                type: string
 *              payment_method:
 *                type: string
 *              visit_date:
 *                type: string
 *              rental_date:
 *                type: string
 *              visit_date_txt:
 *                type: string
 *              rental_date_txt:
 *                type: string
 *              return_date:
 *                type: string
 *              return_condition:
 *                type: string
 *              order_details:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    item_id:
 *                      type: integer
 *                    quantity:
 *                      type: integer
 *                    price:
 *                      type: number
 *    responses:
 *      201:
 *        description: La orden y sus detalles se han creado correctamente
 *      500:
 *        description: Error del servidor al crear la orden y sus detalles
 */


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



/**
 * @swagger
 * /orders/{order_id}:
 *  delete:
 *    summary: Elimina una orden específica
 *    tags: [Orders]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: order_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID de la orden
 *    responses:
 *      200:
 *        description: Orden eliminada con éxito
 *      404:
 *        description: Orden no encontrada
 *      500:
 *        description: Error del servidor al eliminar la orden
 */


router.delete(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteOrder
);




/**
 * @swagger
 * /orders/status/{order_id}:
 *  put:
 *    summary: Actualiza el estado de una orden específica
 *    tags: [Orders]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: order_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID de la orden
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status_order:
 *                type: string
 *    responses:
 *      200:
 *        description: Estado de la orden actualizado con éxito
 *      404:
 *        description: Orden no encontrada
 *      500:
 *        description: Error del servidor al actualizar el estado de la orden
 */


router.put(
  "/status/:order_id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateOrderStatus
);



/**
 * @swagger
 * /orders/{order_id}:
 *  put:
 *    summary: Actualiza una orden específica
 *    tags: [Orders]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: order_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID de la orden
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              total_price:
 *                type: number
 *              status_order:
 *                type: string
 *              delivery_address:
 *                type: string
 *              payment_method:
 *                type: string
 *              visit_date:
 *                type: string
 *              rental_date:
 *                type: string
 *              visit_date_txt:
 *                type: string
 *              rental_date_txt:
 *                type: string
 *              return_date:
 *                type: string
 *              return_condition:
 *                type: string
 *    responses:
 *      200:
 *        description: Orden actualizada con éxito
 *      404:
 *        description: Orden no encontrada
 *      500:
 *        description: Error del servidor al actualizar la orden
 */

// Ruta para actualizar una orden
router.put(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);



/**
 * @swagger
 * /orders/details:
 *  get:
 *    summary: Obtiene todos los detalles de las órdenes
 *    tags: [Orders]
 *    responses:
 *      200:
 *        description: Lista de todos los detalles de las órdenes
 *      500:
 *        description: Error del servidor al obtener los detalles de las órdenes
 */

router.get(
  "/details",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrdersWithDetails
);



/**
 * @swagger
 * /orders/with-details:
 *  post:
 *    summary: Crea una nueva orden con detalles
 *    tags: [Orders]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              order:
 *                type: object
 *                properties:
 *                  user_id:
 *                    type: integer
 *                  total_price:
 *                    type: number
 *                  status_order:
 *                    type: string
 *                required:
 *                  - user_id
 *                  - total_price
 *                  - status_order
 *              orderDetails:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    product_id:
 *                      type: integer
 *                    quantity:
 *                      type: integer
 *    responses:
 *      201:
 *        description: Orden creada con éxito
 *      400:
 *        description: Datos de entrada inválidos
 *      500:
 *        description: Error del servidor al crear la orden
 */



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


/**
 * @swagger
 * /orders/details/all:
 *  get:
 *    summary: Obtiene todos los detalles de las órdenes
 *    tags: [Orders]
 *    security:
 *      - jwt: []
 *    responses:
 *      200:
 *        description: Lista de detalles de las órdenes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  order_id:
 *                    type: integer
 *                  product_id:
 *                    type: integer
 *                  quantity:
 *                    type: integer
 *      500:
 *        description: Error del servidor al obtener los detalles de las órdenes
 */

router.get(
  "/details/all",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getOrderDetails
);



/**
 * @swagger
 * /orders/{order_id}/details:
 *   get:
 *     summary: Recupera los detalles de una orden por su ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalles de la orden encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Detalles de la orden no encontrados
 *       500:
 *         description: Error al recuperar los detalles de la orden
 */


router.get(
  "/details/:order_id",
  passport.authenticate("jwt", { session: false }),
  getOrderDetailsById
);












module.exports = router;