const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');




/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Rutas para la gestión de roles
 */

/**
 * @swagger
 * /roles:
 *  get:
 *    summary: Obtiene todos los roles
 *    tags: [Roles]
 *    responses:
 *      200:
 *        description: Lista de roles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  role_id:
 *                    type: integer
 *                  role_name:
 *                    type: string
 *      500:
 *        description: Error del servidor al obtener los roles
 */


router.get('/', roleController.getAllRoles);


/**
 * @swagger
 * /roles/{role_id}:
 *  get:
 *    summary: Obtiene un rol por ID
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: role_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del rol
 *    responses:
 *      200:
 *        description: Rol encontrado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role_id:
 *                  type: integer
 *                role_name:
 *                  type: string
 *      404:
 *        description: Rol no encontrado
 *      500:
 *        description: Error del servidor al obtener el rol
 */


router.get('/:role_id', roleController.getRoleById);


/**
 * @swagger
 * /roles:
 *  post:
 *    summary: Crea un nuevo rol
 *    tags: [Roles]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              role_name:
 *                type: string
 *            required:
 *              - role_name
 *    responses:
 *      201:
 *        description: Rol creado con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role_id:
 *                  type: integer
 *                role_name:
 *                  type: string
 *      500:
 *        description: Error del servidor al crear el rol
 */


router.post('/', roleController.createRole);


/**
 * @swagger
 * /roles/{id}:
 *  put:
 *    summary: Actualiza un rol
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del rol
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              role_name:
 *                type: string
 *            required:
 *              - role_name
 *    responses:
 *      200:
 *        description: Rol actualizado con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role_id:
 *                  type: integer
 *                role_name:
 *                  type: string
 *      404:
 *        description: Rol no encontrado
 *      500:
 *        description: Error del servidor al actualizar el rol
 */

router.put('/:id', roleController.updateRole);


/**
 * @swagger
 * /roles/{id}:
 *  delete:
 *    summary: Elimina un rol
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del rol
 *    responses:
 *      200:
 *        description: Rol eliminado con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role_id:
 *                  type: integer
 *                role_name:
 *                  type: string
 *      404:
 *        description: Rol no encontrado
 *      500:
 *        description: Error del servidor al eliminar el rol
 */


router.delete('/:id', roleController.deleteRole);

module.exports = router;
