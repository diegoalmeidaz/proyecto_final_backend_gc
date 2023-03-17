const { Router } = require('express')
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  updateUser,
  deleteUser,
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { registerValidation, loginValidation } = require('../validators/auth')
const { userAuth, adminAuth } = require('../middlewares/auth-middleware') // Asegúrate de tener solo esta línea para importar los middlewares
const router = Router()

router.get('/get-users', getUsers)
router.get('/protected', userAuth, protected)
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.put('/users/:user_id', updateUser);
router.delete('/auth/delete/:user_id', userAuth, adminAuth, deleteUser);

module.exports = router
