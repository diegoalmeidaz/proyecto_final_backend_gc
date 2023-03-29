const db = require("../db/pool");
const { hash } = require("bcryptjs");
const { decrypt, encrypt } = require("../encryption/encryption");
const CryptoJS = require("crypto-js");
const secretKey = 'aXveryXcomplexXandXlongXsecretXkey123';

const getUserRolesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `
        SELECT roles.role_id, roles.role_name
        FROM user_roles
        INNER JOIN roles ON user_roles.role_id = roles.role_id
        WHERE user_roles.user_id = $1
      `;
    const { rows } = await db.query(query, [user_id]);

    // Encriptar los datos antes de enviarlos al cliente
    // console.log("Datos antes de encriptar:", JSON.stringify(rows));
    const encryptedData = encrypt(JSON.stringify(rows));

    // console.log("Datos después de encriptar:", encryptedData);

    res.status(200).json({ encryptedData });
  } catch (error) {
    console.error("Error al obtener los roles del usuario:", error);
    res.status(500).json({ message: "Error al obtener los roles del usuario" });
  }
};

const createUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const { rows } = await db.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *",
      [user_id, role_id]
    );
    const newUserRole = rows[0];
    res.status(201).json(newUserRole);
  } catch (error) {
    console.error("Error al crear el user_role:", error);
    res.status(500).json({ message: "Error al crear el user_role" });
  }
};

const deleteUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;
    const deletedUserRole = await db.oneOrNone(
      "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *",
      [user_id, role_id]
    );
    if (deletedUserRole) {
      res.status(200).json(deletedUserRole);
    } else {
      res.status(404).json({ message: "User_role no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el user_role:", error);
    res.status(500).json({ message: "Error al eliminar el user_role" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { roles } = req.body;
    const queryDelete = "DELETE FROM user_roles WHERE user_id = $1";
    await db.query(queryDelete, [user_id]);

    const queryInsert =
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)";
    for (const role_id of roles) {
      await db.query(queryInsert, [user_id, role_id]);
    }
    res.status(200).json({ message: "Roles de usuario actualizados" });
  } catch (error) {
    console.error("Error al actualizar los roles del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar los roles del usuario" });
  }
};

const updateUserInfoAndRole = async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  const decryptedData = decrypt(req.body.encryptedData);
  const { name, lastname, email, username, password, roles, phone, address } = decryptedData;

  try {
    // Iniciar una transacción
    await db.query("BEGIN");

    // Actualizar información del usuario en la tabla "users"
    const hashedPassword = password ? await hash(password, 10) : null;
    const queryUpdateUser = `
        UPDATE users SET
          name = COALESCE($1, name),
          lastname = COALESCE($2, lastname),
          email = COALESCE($3, email),
          username = COALESCE($4, username),
          password = COALESCE($5, password),
          phone = COALESCE($6, phone),
          address = COALESCE($7, address)
        WHERE user_id = $8
        RETURNING *
      `;
    const { rows: updatedUserRows } = await db.query(queryUpdateUser, [
      name,
      lastname,
      email,
      username,
      hashedPassword,
      phone,
      address,
      user_id,
    ]);
    const updatedUser = updatedUserRows[0];

    
    if (roles && Array.isArray(roles)) {
      const queryDeleteRoles = "DELETE FROM user_roles WHERE user_id = $1";
      await db.query(queryDeleteRoles, [user_id]);

      const queryInsertRole =
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)";
      for (const role_id of roles) {
        await db.query(queryInsertRole, [user_id, role_id]);
      }
    }

   
    await db.query("COMMIT");

    res
      .status(200)
      .json({
        message: "User info and roles updated successfully",
        user: updatedUser,
      });
  } catch (error) {
   // console.log("Error updating user info and roles:", error.message);
    res.status(500).json({ error: error.message });


    await db.query("ROLLBACK");
  }
};


module.exports = {
  getUserRolesByUserId,
  createUserRole,
  deleteUserRole,
  updateUserRole,
  updateUserInfoAndRole,
};
