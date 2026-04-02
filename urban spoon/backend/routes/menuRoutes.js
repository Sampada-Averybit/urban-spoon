const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, authorizeRoles, ROLES } = require('../middleware/authMiddleware');

// Map endpoints to controller functions
router.get('/', menuController.getAllMenu);
router.get('/:id', menuController.getMenuById);
router.post('/', protect, authorizeRoles(ROLES.ADMIN), menuController.createMenu);
router.put('/:id', protect, authorizeRoles(ROLES.ADMIN), menuController.updateMenu);
router.delete('/:id', protect, authorizeRoles(ROLES.ADMIN), menuController.deleteMenu);

module.exports = router;
