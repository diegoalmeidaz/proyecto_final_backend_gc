const db = require('../db/pool');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants/ports');
const {SECRET_KEY} = require('../constants/ports');
const CryptoJS = require('crypto-js');
const { encrypt, decrypt } = require('../encryption/encryption');




exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select user_id, username, email from users');

    const encryptedRows = rows.map(row => ({
      user_id: row.user_id,
      username: encrypt(row.username),
      email: encrypt(row.email),
    }));

    return res.status(200).json({
      success: true,
      users: encryptedRows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { email, password, username, name, lastname, role } = req.body;

  try {
    const hashedPassword = await hash(password, 10);

    const role_name = role || 'renter';

    const roleResult = await db.query('INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING RETURNING role_id', [role_name]);
    const roleId = roleResult.rowCount > 0 ? roleResult.rows[0].role_id : (await db.query('SELECT role_id FROM roles WHERE role_name = $1', [role_name])).rows[0].role_id;

    const userResult = await db.query(
      'INSERT INTO users(email, password, username, name, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING user_id', // Eliminamos la columna 'role'
      [email, hashedPassword, username, name, lastname]
    );

    const userId = userResult.rows[0].user_id;

    await db.query('INSERT INTO user_roles(user_id, role_id) VALUES ($1, $2)', [userId, roleId]);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  let user = req.user;

  let payload = {
    id: user.user_id,
    username: user.username,
  };

  try {
    const token = await sign(payload, SECRET);

    return res
      .status(200)
      .cookie('token', token, { httpOnly: true })
      .json({
        success: true,
        message: 'Logged in successfully',
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


exports.updateUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { name, lastname, email, phone, address } = req.body;

  try {
    const { rows } = await db.query('UPDATE users SET name = $1, lastname = $2, email = $3, phone = $4, address = $5 WHERE user_id = $6 RETURNING *', [name, lastname, email, phone, address, user_id]);

    const updatedUser = {
      ...rows[0],
      name: rows[0].name,
      lastname: rows[0].lastname,
      email: rows[0].email,
      phone: rows[0].phone,
      address: rows[0].address,
    };

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  
  
  const { user_id: id } = req.params;

  try {
    console.log(`Deleting user with id: ${id}`);

    // Elimina todos los elementos relacionados con el usuario
    await db.query('DELETE FROM items WHERE user_id = $1', [id]);

    // Elimina las relaciones de roles del usuario
    await db.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

    // Elimina al usuario
    const { rowCount } = await db.query('DELETE FROM users WHERE user_id = $1', [id]);

    if (!rowCount) {
      return res.status(404).json({ message: `User with id ${id} not found` });
    }

    res.status(204).json();
  } catch (error) {
    console.log(`Error deleting user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};




exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const { rows } = await db.query(`
      SELECT users.user_id, users.username, users.email, users.name, users.lastname, roles.role_name
      FROM users
      INNER JOIN user_roles ON users.user_id = user_roles.user_id
      INNER JOIN roles ON user_roles.role_id = roles.role_id
      WHERE users.user_id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userInfo = rows[0];
    return res.status(200).json({
      success: true,
      user: {
        user_id: userInfo.user_id,
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role_name,
        name: userInfo.name,
        lastname: userInfo.lastname,
        
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


exports.updatePassword = async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { newPassword } = req.body;

  // console.log('user_id:', user_id); // Mostrará el user_id en la consola del servidor
  // console.log('newPassword:', newPassword); // Mostrará la contraseña nueva en la consola del servidor

  try {
    const hashedPassword = await hash(newPassword, 10); // Cambia bcrypt.hash por hash
    const { rows } = await db.query('UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *', [hashedPassword, user_id]);

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




