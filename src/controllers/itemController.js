const db = require("../db/pool");
const { isNil } = require("lodash");

// create (POST)
exports.create = async (req, res) => {
  const {
    name,
    color,
    price,
    brand,
    category,
    src,
    is_liked,
    purchase_year,
    purchase_country,
    description,
    short_description,
    renter_name,
    renter_lastname,
    renter_email,
    availability,
    size,
    laundry_charge,
    renters_commision,
    safe_deposit,
    independent_designer_dress,
    user_id,
    purchase_price_paid_by_renter,
  } = req.body;

  try {
    const { rows } = await db.query(
      "INSERT INTO items (name, color, price, brand, category, src, is_liked, purchase_year, purchase_country, description, short_description, renter_name, renter_lastname, renter_email, availability, size, laundry_charge, renters_commision, safe_deposit, independent_designer_dress, user_id, purchase_price_paid_by_renter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *",
      [
        name,
        color,
        price,
        brand,
        category,
        src,
        is_liked,
        purchase_year,
        purchase_country,
        description,
        short_description,
        renter_name,
        renter_lastname,
        renter_email,
        availability,
        size,
        laundry_charge,
        renters_commision,
        safe_deposit,
        independent_designer_dress,
        user_id,
        purchase_price_paid_by_renter,
      ]
    );

     res.json(rows[0]);
  } catch (error) {
    console.error("Error en la creación del artículo:", error);
    res.status(500).json({ error: error.message });
  }
};



// update (PUT)
exports.update = async (req, res) => {
  const item_id = parseInt(req.params.item_id, 10);
  const {
    name,
    brand, // Agrega la variable brand aquí
    color,
    price,
    category,
    src,
    is_liked,
    purchase_year,
    purchase_country,
    description,
    short_description,
    renter_name,
    renter_lastname,
    renter_email,
    availability,
    size,
    laundry_charge,
    renters_commision,
    safe_deposit,
    independent_designer_dress,
    user_id,
    purchase_price_paid_by_renter,
  } = req.body;
  // console.log("Datos recibidos del front-end:", req.body); // console log para ver que es lo que estamos recibiendo del front.

  try {
    const { rows } = await db.query(
      // Agrega brand a la consulta SQL
      "UPDATE items SET name = $1, brand = $2, color = $3, price = $4, category = $5, src = $6, is_liked = $7, purchase_year = $8, purchase_country = $9, description = $10, short_description = $11, renter_name = $12, renter_lastname = $13, renter_email = $14, availability = $15, size = $16, laundry_charge = $17, renters_commision = $18, safe_deposit = $19, independent_designer_dress = $20, user_id = $21, purchase_price_paid_by_renter = $22 WHERE item_id = $23 RETURNING *",
      [
        name,
        brand, // Agrega brand a los parámetros de la consulta
        color,
        price,
        category,
        src,
        is_liked,
        purchase_year,
        purchase_country,
        description,
        short_description,
        renter_name,
        renter_lastname,
        renter_email,
        availability,
        size,
        laundry_charge,
        renters_commision,
        safe_deposit,
        independent_designer_dress,
        user_id,
        purchase_price_paid_by_renter,
        item_id,
      ]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error en la actualizacion del artículo:", error);
    res.status(500).json({ error: error.message });
  }
};


// delete (DELETE)
exports.delete = async (req, res) => {
  const { item_id } = req.params;

  try {
    const { rowCount } = await db.query(
      "DELETE FROM items WHERE item_id = $1",
      [item_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found, unable to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


exports.getItems = async (filters) => {
  try {
    const { rows } = await db.query("SELECT * FROM items");
    const itemsWithRoles = [];

    for (const item of rows) {
      const role_id = await getRoleByUserId(item.user_id);
      itemsWithRoles.push({ ...item, role_id });
    }

    return applyFilters(itemsWithRoles, filters);
  } catch (error) {
    throw new Error(error.message);
  }
};

// get by id (GET)
exports.getById = async (req, res) => {
  const { item_id } = req.params;

  try {
    const { rows } = await db.query("SELECT * FROM items WHERE item_id = $1", [
      item_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





function containsSizes(sizes, product) {
  // Caso base, no omitir productos cuando no hay filtros de tamaño
  if (!sizes) return true;

  // Omitir productos con tamaños "null" o vacíos
  if (!product.size) return false;

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
  if (!brands) return true;

  if (!product.brand) return false;

  const selectedBrands = new Set(brands.split(","));
  const productBrand = product.brand;

  if (selectedBrands.has(productBrand)) {
    return true;
  }

  return false;
}

function containsColors(colors, product) {
  if (!colors) return true;

  if (!product.color) return false;

  const selectedColors = new Set(colors.split(","));
  const productColor = product.color;

  if (selectedColors.has(productColor)) {
    return true;
  }

  return false;
}


function containsIndependentDesignerDresses(independentFilter, product) {
  // Caso base, no omitir productos cuando no hay filtros de diseñador independiente
  if (!independentFilter) return true;

  // Omitir productos con valores "null" en independent_designer_dress
  if (product.independent_designer_dress === null) return false;

  // Comprueba si el producto es un vestido de diseñador independiente
  if (product.independent_designer_dress) {
    return true;
  }

  // No es un vestido de diseñador independiente, omite este producto
  return false;
}


async function getRoleByUserId(user_id) {
  try {
    const { rows } = await db.query(
      "SELECT role_id FROM user_roles WHERE user_id = $1",
      [user_id]
    );
    if (rows.length > 0) {
      return rows[0].role_id;
    }
    return null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function applyFilters(
  products,
  { query, sort, colors, sizes, minPrice, maxPrice, brands, independentFilter }
) {
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

    if (!containsIndependentDesignerDresses(independentFilter, product)) {
      continue;
    }

    if (!isNil(minPrice) && product.price / 100 < minPrice) {
      continue;
    }

    if (!isNil(maxPrice) && product.price / 100 > maxPrice) {
      continue;
    }

    // Obtenemos el role_id del usuario utilizando la función getRoleByUserId
    const role_id = await getRoleByUserId(product.user_id);

    // Aplica la lógica basada en el rol aquí utilizando el valor de role_id
    // ...

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
  getById: exports.getById,
  applyFilters,
  containsColors,
  containsSizes,
  containsIndependentDesignerDresses,
};
