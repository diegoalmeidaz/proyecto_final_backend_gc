const db = require('../db/pool');

const getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await db.query('SELECT * FROM user_roles');
    res.status(200).json(userRoles.rows);
  } catch (error) {
    console.error('Error al obtener los user_roles:', error);
    res.status(500).json({ message: 'Error al obtener los user_roles' });
  }
};

const createUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const { rows } = await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *', [user_id, role_id]);
    const newUserRole = rows[0];
    res.status(201).json(newUserRole);
  } catch (error) {
    console.error('Error al crear el user_role:', error);
    res.status(500).json({ message: 'Error al crear el user_role' });
  }
};

const deleteUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;
    const deletedUserRole = await db.oneOrNone('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *', [user_id, role_id]);
    if (deletedUserRole) {
      res.status(200).json(deletedUserRole);
    } else {
      res.status(404).json({ message: 'User_role no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el user_role:', error);
    res.status(500).json({ message: 'Error al eliminar el user_role' });
  }
};


const updateUserRole = async (req, res) => {
    try {
      const { user_id, role_id } = req.params;
      const { new_role_id } = req.body;
  
      const updatedUserRole = await db.oneOrNone(
        'UPDATE user_roles SET role_id = $1 WHERE user_id = $2 AND role_id = $3 RETURNING *',
        [new_role_id, user_id, role_id]
      );
  
      if (updatedUserRole) {
        res.status(200).json(updatedUserRole);
      } else {
        res.status(404).json({ message: 'User_role no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el user_role:', error);
      res.status(500).json({ message: 'Error al actualizar el user_role' });
    }
  };


module.exports = {
  getAllUserRoles,
  createUserRole,
  deleteUserRole,
  updateUserRole
};
