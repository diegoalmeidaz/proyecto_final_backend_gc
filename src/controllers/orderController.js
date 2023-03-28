const db = require("../db/pool");
const { encrypt, decrypt } = require("../encryption/encryption");
const { validationResult } = require("express-validator");

const sensitiveColumns = ["delivery_address", "payment_method"];

function encryptSensitiveData(data) {
  console.log("In encryptSensitiveData:", data); // Comentar console log
  return sensitiveColumns.reduce((acc, column) => {
    if (data[column]) {
      acc[column] = encrypt(data[column]);
    }
    return acc;
  }, {});
}

function decryptSensitiveData(data) {
  console.log("In decryptSensitiveData:", data); // Comentar console log
  return sensitiveColumns.reduce((acc, column) => {
    if (data[column]) {
      acc[column] = decrypt(data[column]);
    }
    return acc;
  }, {});
}

// getOrders (GET)
exports.getOrders = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getOrderById (GET)
exports.getOrderById = async (req, res) => {
  const order_id = parseInt(req.params.order_id, 10);

  try {
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createOrder = async (req, res) => {
//   console.log("In createOrder:", req.body); // Comentar console Log
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const {
//     user_id,
//     visit_date,
//     rental_date,
//     visit_date_txt,
//     rental_date_txt,
//     total_price,
//     status_order,
//     return_date,
//     return_condition,
//     delivery_address,
//     payment_method,
//   } = req.body;

//   const encryptedData = encryptSensitiveData({
//     delivery_address,
//     payment_method,
//   });

//   const query = `INSERT INTO orders (user_id, visit_date, rental_date, visit_date_txt, rental_date_txt, total_price, status_order, return_date, return_condition, delivery_address, payment_method)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
//   const values = [
//     user_id,
//     visit_date,
//     rental_date,
//     visit_date_txt,
//     rental_date_txt,
//     total_price,
//     status_order,
//     return_date,
//     return_condition,
//     encryptedData.delivery_address,
//     encryptedData.payment_method,
//   ];

//   try {
//     console.log("Executing createOrder query:", query, values); // Comentar Console log
//     const result = await db.query(query, values);
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error in createOrder:", error); // Comentar console log
//     res.status(500).json({ error: "Error al crear la orden" });
//   }
// };




exports.createOrder = async (order) => {
  console.log("In createOrder:", order);
  console.log("Order object in createOrder:", order); // Añadir aquí
  console.log('Order before destructuring:', order);

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
    payment_method,
  } = order;

  const encryptedData = encryptSensitiveData({
    delivery_address,
    payment_method,
  });

  const query = `INSERT INTO orders (user_id, visit_date, rental_date, visit_date_txt, rental_date_txt, total_price, status_order, return_date, return_condition, delivery_address, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
  const values = [
    user_id,
    visit_date,
    rental_date,
    visit_date_txt,
    rental_date_txt,
    total_price,
    status_order,
    return_date,
    return_condition,
    encryptedData.delivery_address,
    encryptedData.payment_method,
  ];

  try {
    console.log("Executing createOrder query:", query, values);
    const result = await db.query(query, values); // Asegúrate de tener "await" aquí
    console.log("Result from createOrder query:", result); // Añadir este console.log
    return result.rows[0];
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};







exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    await db.query("BEGIN");

    await db.query("DELETE FROM order_details WHERE order_id = $1", [order_id]);
    await db.query("DELETE FROM orders WHERE order_id = $1", [order_id]);
    await db.query("COMMIT");

    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error(error);
    await db.query("ROLLBACK");

    res.status(500).json({ message: "Error al eliminar la orden" });
  }
};


exports.getOrdersByAdmin = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
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
    console.log("Executing updateOrderStatus query:", order_status, order_id); // console log a esconder
    await db.query("UPDATE orders SET order_status = $1 WHERE order_id = $2", [
      order_status,
      order_id,
    ]);
    res
      .status(200)
      .json({ message: "Estado de la orden actualizado correctamente" });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error); 
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la orden" });
  }
};

exports.updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const { visit_date, rental_date, visit_date_txt, rental_date_txt } = req.body;

  try {
    console.log(
      "Executing updateOrder query:",
      visit_date,
      rental_date,
      visit_date_txt,
      rental_date_txt,
      order_id
    ); 
    const result = await db.query(
      "UPDATE orders SET visit_date = $1, rental_date = $2, visit_date_txt = $3, rental_date_txt = $4 WHERE order_id = $5 RETURNING *",
      [visit_date, rental_date, visit_date_txt, rental_date_txt, order_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    
    const decryptedData = decryptSensitiveData(order);
    const responseOrder = { ...order, ...decryptedData };

    res.status(200).json(responseOrder);
  } catch (error) {
    console.error("Error in updateOrder:", error);
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
};


exports.createOrderDetails = async (order_id, orderDetails) => {
  const query = `INSERT INTO order_details (order_id, item_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`;

  for (const detail of orderDetails) {
    const values = [order_id, detail.item_id, detail.quantity, detail.price];
    try {
      await db.query(query, values);
    } catch (error) {
      console.error('Error in createOrderDetails:', error);
      throw error;
    }
  }
};


// getOrdersByUser (GET)
exports.getOrdersByUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);

  try {
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the specified user",
      });
    }

    // Desencriptar la información sensible antes de enviarla al cliente
    const decryptedOrders = await Promise.all(rows.map(async (order) => {
      const decryptedData = decryptSensitiveData(order);
      
      const orderDetailsResult = await db.query(
        "SELECT * FROM order_details WHERE order_id = $1",
        [order.order_id]
      );
      const orderDetails = orderDetailsResult.rows;

      return { ...order, ...decryptedData, orderDetails };
    }));

    res.json(decryptedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getOrdersWithDetails = async (req, res) => {
  try {
    const ordersResult = await db.query("SELECT * FROM orders");
    const orders = ordersResult.rows;

    console.log('orders:', orders);

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        console.log('order.order_id:', order.order_id);

        const orderDetailsResult = await db.query(
          "SELECT * FROM order_details WHERE order_details.order_id = $1",
          [order.order_id]
        );
        const orderDetails = orderDetailsResult.rows;

        return { ...order, orderDetails };
      })
    );

    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.createOrderWithDetails = async (req, res) => {
//   console.log("In createOrderWithDetails:", req.body); // Comentar console Log
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { order, orderDetails } = req.body;

//   try {
//     // Crear la orden utilizando la función createOrder que ya tienes
//     const createdOrder = await createOrder(order);

    
//     await exports.createOrderDetails(createdOrder.order_id, orderDetails);

//     res.status(201).json(createdOrder);
//   } catch (error) {
//     console.error("Error in createOrderWithDetails:", error); // Comentar console log
//     res.status(500).json({ error: "Error al crear la orden y sus detalles" });
//   }
// };


exports.createOrderWithDetails = async (req, res) => {
  console.log("In createOrderWithDetails:", req.body);

  const {
    user_id,
    total_price,
    status_order,
    delivery_address,
    payment_method,
    visit_date,
    rental_date,
    visit_date_txt,
    rental_date_txt,
    return_date,
    return_condition,
    order_details,
  } = req.body;

  const order = {
    user_id,
    total_price,
    status_order,
    delivery_address,
    payment_method,
    visit_date,
    rental_date,
    visit_date_txt,
    rental_date_txt,
    return_date,
    return_condition,
  };

  console.log("Order object in createOrderWithDetails:", order); // Añadir aquí

  try {
    await db.query("BEGIN");

    const createdOrder = await exports.createOrder(order);

    await exports.createOrderDetails(createdOrder.order_id, order_details);

    await db.query("COMMIT");

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error in createOrderWithDetails:", error);

    await db.query("ROLLBACK");

    res.status(500).json({ error: "Error al crear la orden y sus detalles" });
  }
};
