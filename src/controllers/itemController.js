const db = require('../db/pool');
const { isNil } = require("lodash");

// create (POST)
exports.create = async (req, res) => {
    const { name, color, price, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, user_id, role_id } = req.body;
  
    try {
      const { rows } = await db.query('INSERT INTO items (name, color, price, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, user_id, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *', [name, color, price, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, user_id, role_id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// update (PUT)
exports.update = async (req, res) => {
    const item_id = parseInt(req.params.item_id, 10);
    const { name, color, price, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, user_id, role_id } = req.body;
  
    try {
      const { rows } = await db.query('UPDATE items SET name = $1, color = $2, price = $3, category = $4, src = $5, is_liked = $6, purchase_year = $7, purchase_country = $8, description = $9, short_description = $10, renter_name = $11, renter_lastname = $12, renter_email = $13, availability = $14, size = $15, user_id = $16, role_id = $17 WHERE item_id = $18 RETURNING *', [name, color, price, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, user_id, role_id, item_id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
  // delete (DELETE)
  exports.delete = async (req, res) => {
    const { item_id } = req.params;
  
    try {
      const { rowCount } = await db.query('DELETE FROM items WHERE item_id = $1', [item_id]);
  
      if (rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found, unable to delete',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: error.message,
      });
    }
  };
  
  
  
  // getItems (GET)
  exports.getItems = async () => {
    try {
      const { rows } = await db.query('SELECT * FROM items');
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };


  function containsSizes(sizes, product) {
    // Caso base, no omitir productos cuando no hay filtros de tamaño
    if (!sizes) return true;
  
    const selectedSizes = new Set(sizes.split(","));
    const productSize = product.size;
  
    // Comprueba si el tamaño del producto está en el filtro
    if (selectedSizes.has(productSize)) {
      return true;
    }
  
    // No contiene ninguno de los tamaños filtrados, omite este producto
    return false;
  }

  function containsBrands(brands, product) {
    // base case, do not skip products when there are no brand filters
    if (!brands) return true;
  
    const selectedBrands = new Set(brands.split(","));
    const productBrand = product.brand;
  
    // check if the product brand is in the filter
    if (selectedBrands.has(productBrand)) {
      return true;
    }
  
    // does not contain any of the filtered brands, skip this product
    return false;
  }
  


  function containsColors(colors, product) {
    // base case, do not skip products when there are no color filters
    if (!colors) return true;
  
    const selectedColors = new Set(colors.split(","));
    const productColor = product.color;
  
    // check if the product color is in the filter
    if (selectedColors.has(productColor)) {
      return true;
    }
  
    // does not contain any of the filtered colors, skip this product
    return false;
  }
  
  function applyFilters(products, { query, sort, colors, sizes, minPrice, maxPrice, brands }) {
    const filteredProducts = [];
  
    // Omitir productos basados en filtros
    for (const product of products) {
      if (query && !product.name.toLowerCase().includes(query.toLowerCase())) {
        continue;
      }
  
      if (!containsColors(colors, product)) {
        continue;
      }
      
      if (!containsBrands(brands, product)) {
        continue;
      }
  
      if (!containsSizes(sizes, product)) {
        continue;
      }
  
      if (!isNil(minPrice) && product.price / 100 < minPrice) {
        continue;
      }
  
      if (!isNil(maxPrice) && product.price / 100 > maxPrice) {
        continue;
      }
  
      filteredProducts.push(product);
    }
  
    return filteredProducts.sort((a, b) => {
      const { name, price } = a;
      const { name: nameB, price: priceB } = b;
  
      switch (sort) {
        case "priceDesc":
          return priceB - price;
        case "priceAsc":
          return price - priceB;
        default:
          return name.localeCompare(nameB);
      }
    });
  }

  module.exports = {
    create: exports.create,
    getItems: exports.getItems,
    update: exports.update,
    delete: exports.delete,
    applyFilters,
    containsColors,
    containsSizes,
  };
