const express = require("express");
const router = express.Router();
const { isNil } = require("lodash");
const pool = require("../db/pool");
const itemController = require("../controllers/itemController");

router.get('/', async (req, res) => {
  try {
    const items = await itemController.getItems(req.query);
    const maxPrice = Math.round(Math.max(...items.map((product) => product.price)));

    setTimeout(() => {
      res.json({ products: items, maxPrice });
    }, 250);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - obtener un ítem específico por ID
router.get("/:item_id", itemController.getById);


// POST - agregar un nuevo producto
router.post("/", itemController.create);

// Function to build update query
function buildUpdateQuery(table, id, data) {
  const keys = Object.keys(data).filter((key) => !isNil(data[key]));
  const values = keys.map((key) => data[key]);

  let query = `UPDATE ${table} SET `;
  query += keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
  query += ` WHERE item_id=${id} RETURNING *`;

  return { query, values };
}

// PUT - actualizar un producto existente
router.put("/:item_id", async (req, res) => {
  try {
    const { item_id } = req.params;
    const { query, values } = buildUpdateQuery("items", item_id, req.body);

    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - eliminar un producto
router.delete("/:item_id", itemController.delete);

module.exports = router;
