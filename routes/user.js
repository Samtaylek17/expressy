const express = require('express');
const { uploadPhoto, updateProfile, getProfile } = require('../controllers/user');
const {
	signup,
	login,
	logout,
	protect,
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Using middlewares to protect all routes after this line
// router.use(protect);
router.patch('/update-password', protect, updatePassword);
router.get('/me', protect, getProfile);
router.patch('/update-me', protect, uploadPhoto, updateProfile);

module.exports = router;
