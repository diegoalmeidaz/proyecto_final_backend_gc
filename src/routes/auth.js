const { Router } = require('express')

const {
  getUsers,
  register,
  login,
  logout,
  updateUser,
  deleteUser,
  getUserInfo,
  updatePassword,
  protectedRoute, 
  getUserInfoById,
  register_admin,
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { registerValidation, loginValidation } = require('../validators/auth')
const { userAuth, adminAuth } = require('../middlewares/auth-middleware')
const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con la autenticación de usuarios
 */

/**
/**
 * @swagger
 * /auth/get-users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Devuelve una lista con la información de todos los usuarios
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: La lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: guapacarlota
 *                       email:
 *                         type: string
 *                         example: guapacarlota@example.com
 */

router.get('/get-users', getUsers)

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Ruta protegida
 *     description: Accede a información protegida, se requiere autenticación
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información protegida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: string
 *                   example: protected info
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 */
router.get('/protected', userAuth, protectedRoute)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario con un rol por defecto de 'renter'
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySuperPassword123
 *               username:
 *                 type: string
 *                 example: johndoe
 *               name:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 example: renter
 *             required:
 *               - email
 *               - password
 *               - username
 *               - name
 *               - lastname
 *     responses:
 *       201:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */

router.post('/register', registerValidation, validationMiddleware, register)

/**
 * @swagger
 * /auth/register_admin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de administrador
 *     description: Registra a un nuevo usuario con el rol de administrador
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Usuario administrador registrado con éxito
 *       400:
 *         description: Datos inválidos o faltantes
 */

router.post('/register_admin', registerValidation, validationMiddleware, register_admin)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     description: Inicia sesión con un usuario existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token de acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginValidation, validationMiddleware, login)

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Cerrar sesión
 *     description: Cierra la sesión del usuario actual
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito
 */
router.get('/logout', logout)

/**
 * @swagger
 * /auth/updateinfo/{user_id}:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Actualizar información de usuario
 *     description: Actualiza la información del usuario especificado por user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Información del usuario actualizada con éxito
 *       400:
 *         description: Datos inválidos o faltantes
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/updateinfo/:user_id', updateUser);

/**
 * @swagger
 * /auth/delete/{user_id}:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Eliminar usuario
 *     description: Elimina un usuario por su ID. Solo permitido para administradores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       401:
 *         description: No autorizado, token inválido o faltante
 *       403:
 *         description: Acceso denegado, solo permitido a administradores
 *       404:
 *         description: Usuario no encontrado
 */


router.delete('/auth/delete/:user_id', userAuth, adminAuth, deleteUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtener información del usuario actual
 *     description: Devuelve la información del usuario actual basado en el token de acceso
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado, token inválido o faltante
 */
router.get('/me', userAuth, getUserInfo);

/**
 * @swagger
 * /auth/{user_id}/password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Actualizar contraseña
 *     description: Actualiza la contraseña del usuario especificado por user_id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario al que se le actualizará la contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: Datos inválidos o faltantes
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:user_id/password', updatePassword);

/**
 * @swagger
 * /auth/user/{user_id}:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtener información de usuario por ID
 *     description: Devuelve la información del usuario especificado por user_id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/user/:user_id', getUserInfoById);

module.exports = router
