const db = require('../db/pool');

// create (POST)
const createOrder = async (req, res) => {
  const { visit_date, rental_date, visit_date_txt, rental_date_txt, quantity, total_price, status_order, return_date, return_condition, delivery_address, payment_method, user_id, item_id, price } = req.body;

  try {
    const { rows } = await db.query('INSERT INTO orders (visit_date, rental_date, visit_date_txt, rental_date_txt, quantity, total_price, status_order, return_date, return_condition, delivery_address, payment_method, user_id, item_id, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *', [visit_date, rental_date, visit_date_txt, rental_date_txt, quantity, total_price, status_order, return_date, return_condition, delivery_address, payment_method, user_id, item_id, price]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update (PUT)
const updateOrder = async (req, res) => {
  const order_id = parseInt(req.params.order_id, 10);
  const { visit_date, rental_date, visit_date_txt, rental_date_txt, quantity, total_price, status_order, return_date, return_condition, delivery_address, payment_method, user_id, item_id, price } = req.body;

  try {
    const { rows } = await db.query('UPDATE orders SET visit_date = $1, rental_date = $2, visit_date_txt = $3, rental_date_txt = $4, quantity = $5, total_price = $6, status_order = $7, return_date = $8, return_condition = $9, delivery_address = $10, payment_method = $11, user_id = $12, item_id = $13, price = $14 WHERE order_id = $15 RETURNING *', [visit_date, rental_date, visit_date_txt, rental_date_txt, quantity, total_price, status_order, return_date, return_condition, delivery_address, payment_method, user_id, item_id, price, order_id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete (DELETE)
const deleteOrder = async (req, res) => {
    const { order_id } = req.params;
  
    try {
      const { rowCount } = await db.query('DELETE FROM orders WHERE order_id = $1', [order_id]);
  
      if (rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found, unable to delete',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: error.message,
      });
    }
  };
  
  // getOrders (GET)
  const getOrders = async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM orders');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // getOrderById (GET)
  const getOrderById = async (req, res) => {
    const order_id = parseInt(req.params.order_id, 10);
  
    try {
      const { rows } = await db.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
  
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
  
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrders,
    getOrderById,
  };
  
  
  