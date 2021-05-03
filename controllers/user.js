const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');

const updateProfile = catchAsync(async (req, res, next) => {
	// Return Error If user post password
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route iis not for password update', 400));
	}

	// Filtered out unwanted field names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'firstname', 'lastname', 'email');
});
