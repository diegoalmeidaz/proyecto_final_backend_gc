const express = require('express');
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const { userAuth, adminAuth, adminOrRenterAuth, } = require("../middlewares/auth-middleware");


router.get('/user/:user_id', userRoleController.getUserRolesByUserId);
router.post('/', userRoleController.createUserRole);
router.delete('/:user_id/:role_id', userRoleController.deleteUserRole);
router.put('/user/:user_id', userRoleController.updateUserRole);
router.put('/user-info-role/:user_id', userAuth, adminOrRenterAuth, userRoleController.updateUserInfoAndRole);


module.exports = router;
