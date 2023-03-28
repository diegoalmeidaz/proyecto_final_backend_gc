const express = require("express");
const router = express.Router();
const { isNil } = require("lodash");
const pool = require("../db/pool");
const itemController = require("../controllers/itemController");


/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Operaciones relacionadas con los items.
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Obtiene una lista de todos los productos con filtros opcionales.
 *     description: Devuelve una lista de todos los productos almacenados en la base de datos. Puede ser filtrado por nombre, color, tamaño, marca, diseñador independiente, precio mínimo y precio máximo.
 *     tags:
 *       - Items
 *     parameters:
 *       - in: query
 *         name: query
 *         description: Filtro de búsqueda opcional para el nombre del producto.
 *         schema:
 *           type: string
 *       - in: query
 *         name: colors
 *         description: Filtro de búsqueda opcional para el color del producto.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sizes
 *         description: Filtro de búsqueda opcional para el tamaño del producto.
 *         schema:
 *           type: string
 *       - in: query
 *         name: brands
 *         description: Filtro de búsqueda opcional para la marca del producto.
 *         schema:
 *           type: string
 *       - in: query
 *         name: independentFilter
 *         description: Filtro de búsqueda opcional para los vestidos de diseñador independiente.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: minPrice
 *         description: Filtro de búsqueda opcional para el precio mínimo del producto.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         description: Filtro de búsqueda opcional para el precio máximo del producto.
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Lista de productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 maxPrice:
 *                   type: number
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */



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


/**
 * @swagger
 * /items/{item_id}:
 *   get:
 *     summary: Obtiene un producto específico por ID.
 *     description: Devuelve un producto específico almacenado en la base de datos utilizando su ID.
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: item_id
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */



// GET - obtener un ítem específico por ID
router.get("/:item_id", itemController.getById);


/**
 * @swagger
 * /items:
 *   post:
 *     summary: Agregar un nuevo producto.
 *     description: Agrega un nuevo producto a la base de datos.
 *     tags:
 *       - Items
 *     requestBody:
 *       description: Datos del nuevo producto.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Producto creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */



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



/**
 * @swagger
 * /items/{item_id}:
 *   put:
 *     summary: Actualizar un producto existente.
 *     description: Actualiza la información de un producto existente en la base de datos.
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: item_id
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del producto.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Producto actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */



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


/**
 * @swagger
 * /items/{item_id}:
 *   delete:
 *     summary: Eliminar un producto.
 *     description: Elimina un producto de la base de datos utilizando su ID.
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: item_id
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Producto eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


// DELETE - eliminar un producto
router.delete("/:item_id", itemController.delete);

module.exports = router;
