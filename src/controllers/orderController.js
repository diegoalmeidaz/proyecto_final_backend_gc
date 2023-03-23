const db = require('../db/pool');
const { encrypt, decrypt } = require('../encryption/encryption');
const { validationResult } = require('express-validator');



const sensitiveColumns = ['delivery_address', 'payment_method'];


function encryptSensitiveData(data) {
  return sensitiveColumns.reduce((acc, column) => {
    if (data[column]) {
      acc[column] = encrypt(data[column]);
    }
    return acc;
  }, {});
}

function decryptSensitiveData(data) {
  return sensitiveColumns.reduce((acc, column) => {
    if (data[column]) {
      acc[column] = decrypt(data[column]);
    }
    return acc;
  }, {});
}




exports.getOrderById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM orders WHERE order_id = $1`,
      [req.params.order_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];

    // desencriptar la información sensible antes de enviarla al cliente
    order.delivery_address = decrypt(order.delivery_address);
    order.payment_method = decrypt(order.payment_method);

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching order' });
  }
};


exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    user_id,
    visit_date,
    rental_date,
    visit_date_txt,
    rental_date_txt,
    total_price,
    status_order,
    return_date,
    return_condition,
    delivery_address,
    payment_method
  } = req.body;

  const encryptedData = encryptSensitiveData({ delivery_address });

  const query = `INSERT INTO orders (user_id, visit_date, rental_date, visit_date_txt, rental_date_txt, total_price, status_order, return_date, return_condition, delivery_address, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
  const values = [user_id, visit_date, rental_date, visit_date_txt, rental_date_txt, total_price, status_order, return_date, return_condition, encryptedData.delivery_address, payment_method];

  try {
    const result = await db.query(query, values);
    const order = result.rows[0];

    // Desencriptar la información sensible antes de enviarla al cliente
    const decryptedData = decryptSensitiveData(order);
    const responseOrder = { ...order, ...decryptedData };

    res.status(201).json(responseOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};





exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    await pool.query("DELETE FROM orders WHERE order_id = $1", [order_id]);
    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la orden" });
  }
};




exports.getOrdersByAdmin = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las órdenes" });
  }
};



exports.updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  try {
    await pool.query("UPDATE orders SET order_status = $1 WHERE order_id = $2", [order_status, order_id]);
    res.status(200).json({ message: "Estado de la orden actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el estado de la orden" });
  }
};




exports.updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const {
    visit_date,
    rental_date,
    visit_date_txt,
    rental_date_txt,
  } = req.body;

  try {
    const result = await db.query(
      "UPDATE orders SET visit_date = $1, rental_date = $2, visit_date_txt = $3, rental_date_txt = $4 WHERE order_id = $5 RETURNING *",
      [visit_date, rental_date, visit_date_txt, rental_date_txt, order_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    // Desencriptar la información sensible antes de enviarla al cliente
    const decryptedData = decryptSensitiveData(order);
    const responseOrder = { ...order, ...decryptedData };

    res.status(200).json(responseOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
};

