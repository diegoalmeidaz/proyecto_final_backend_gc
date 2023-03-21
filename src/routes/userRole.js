const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

router.get('/', userRoleController.getAllUserRoles);
router.post('/', userRoleController.createUserRole);
router.delete('/:user_id/:role_id', userRoleController.deleteUserRole);
router.put('/:user_id/:role_id', userRoleController.updateUserRole);


module.exports = router;
