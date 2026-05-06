const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/users/register
router.post('/register', userController.registerUser);

// POST /api/users/login
router.post('/login', userController.loginUser);

// POST /api/users/forgot-password
router.post('/forgot-password', userController.forgotPassword);

// POST /api/users/reset-password/:token
router.post('/reset-password/:token', userController.resetPassword);

// GET /api/users/profile
router.get('/profile', protect, userController.getUserProfile);

// PUT /api/user/update-profile
router.put('/update-profile', protect, userController.updateUserProfile);

// PUT /api/user/change-password
router.put('/change-password', protect, userController.changeUserPassword);

module.exports = router;
