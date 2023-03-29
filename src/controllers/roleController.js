const db = require('../db/pool');

const getAllRoles = async (req, res) => {
  try {
    const roles = await db.query('SELECT * FROM roles');
    res.status(200).json(roles.rows);
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    res.status(500).json({ message: 'Error al obtener los roles' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { role_id } = req.params;
    const roleIdAsNumber = parseInt(role_id, 10); // Convertir el role_id a número
    const query = 'SELECT * FROM roles WHERE role_id = $1';
    const { rows } = await db.query(query, [roleIdAsNumber]); // Utilizar el roleIdAsNumber en vez del role_id
    const role = rows[0];

    // console.log('Resultado de la consulta:', rows);

    if (!role) {
      return res.status(404).json({ error: 'No se encontró el rol con el ID proporcionado.' });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error('Error al obtener el rol:', error);
    res.status(500).json({ error: 'Error al obtener el rol.' });
  }
};

const createRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    const { rows } = await db.query('INSERT INTO roles (role_name) VALUES ($1) RETURNING *', [role_name]);
    const newRole = rows[0];
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error al crear el rol:', error);
    res.status(500).json({ message: 'Error al crear el rol' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;
    const updatedRole = await db.oneOrNone('UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *', [role_name, id]);
    if (updatedRole) {
      res.status(200).json(updatedRole);
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await db.oneOrNone('DELETE FROM roles WHERE role_id = $1 RETURNING *', [id]);
    if (deletedRole) {
      res.status(200).json(deletedRole);
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Error al eliminar el rol' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
