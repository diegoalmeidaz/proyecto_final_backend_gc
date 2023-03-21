const db = require('../db/pool');

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
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los roles del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los roles del usuario' });
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
        const { user_id } = req.params;
        const { roles } = req.body;
        const queryDelete = 'DELETE FROM user_roles WHERE user_id = $1';
        await db.query(queryDelete, [user_id]);

        const queryInsert = 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)';
        for (const role_id of roles) {
            await db.query(queryInsert, [user_id, role_id]);
        }
        res.status(200).json({ message: 'Roles de usuario actualizados' });
    } catch (error) {
        console.error('Error al actualizar los roles del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar los roles del usuario' });
    }
};


module.exports = {
getUserRolesByUserId,
  createUserRole,
  deleteUserRole,
  updateUserRole
};
