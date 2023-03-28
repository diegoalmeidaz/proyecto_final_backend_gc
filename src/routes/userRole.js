const express = require('express');
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const { userAuth, adminAuth, adminOrRenterAuth, } = require("../middlewares/auth-middleware");


/**
 * @swagger
 * tags:
 *   name: UserRoles
 *   description: Rutas para la gestión de roles por usario
 */

/**
 * @swagger
 * /user-role/user/{user_id}:
 *  get:
 *    summary: Obtener roles de un usuario por ID de usuario
 *    tags: [UserRoles]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del usuario
 *    responses:
 *      200:
 *        description: Lista de roles del usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                encryptedData:
 *                  type: string
 *      500:
 *        description: Error del servidor al obtener los roles del usuario
 */

router.get('/user/:user_id', userRoleController.getUserRolesByUserId);


/**
 * @swagger
 * /user-role/:
 *  post:
 *    summary: Crear una relación usuario-rol
 *    tags: [UserRoles]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *              role_id:
 *                type: integer
 *    responses:
 *      201:
 *        description: Relación usuario-rol creada
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user_id:
 *                  type: integer
 *                role_id:
 *                  type: integer
 *      500:
 *        description: Error del servidor al crear la relación usuario-rol
 */

router.post('/', userRoleController.createUserRole);



/**
 * @swagger
 * /user-role/{user_id}/{role_id}:
 *  delete:
 *    summary: Eliminar una relación usuario-rol
 *    tags: [UserRoles]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del usuario
 *      - in: path
 *        name: role_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del rol
 *    responses:
 *      200:
 *        description: Relación usuario-rol eliminada
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user_id:
 *                  type: integer
 *                role_id:
 *                  type: integer
 *      404:
 *        description: Relación usuario-rol no encontrada
 *      500:
 *        description: Error del servidor al eliminar la relación usuario-rol
 */


router.delete('/:user_id/:role_id', userRoleController.deleteUserRole);


/**
 * @swagger
 * /user-role/user/{user_id}:
 *  put:
 *    summary: Actualizar los roles de un usuario
 *    tags: [UserRoles]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              roles:
 *                type: array
 *                items:
 *                  type: integer
 *    responses:
 *      200:
 *        description: Roles de usuario actualizados
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error del servidor al actualizar los roles del usuario
 */

router.put('/user/:user_id', userRoleController.updateUserRole);

/**
 * @swagger
 * /user-role/user-info-role/{user_id}:
 *  put:
 *    summary: Actualizar la información del usuario y sus roles
 *    tags: [UserRoles]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID del usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              encryptedData:
 *                type: string
 *    responses:
 *      200:
 *        description: Información y roles del usuario actualizados con éxito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                user:
 *                  type: object
 *                  properties:
 *                    user_id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    lastname:
 *                      type: string
 *                    email:
 *                      type: string
 *                    username:
 *                      type: string
 *                    password:
 *                      type: string
 *                    phone:
 *                      type: string
 *                    address:
 *                      type: string
 *      500:
 *        description: Error del servidor al actualizar la información y roles del usuario
 */


router.put('/user-info-role/:user_id', userAuth, adminOrRenterAuth, userRoleController.updateUserInfoAndRole);


module.exports = router;
