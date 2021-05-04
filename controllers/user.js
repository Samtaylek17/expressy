const cloudinary = require('cloudinary').v2;
const User = require('../models/user');
const { imageUploader } = require('../utils/image_uploader');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');
const config = require('../config/config');

cloudinary.config({
	cloud_name: config.CLOUDINARY_CLOUD_NAME,
	api_key: config.CLOUDINARY_API_KEY,
	api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 *
 * @param {*} obj
 * @param  {...any} allowedFields
 * @returns newObj
 */
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});

	return newObj;
};

const uploadPhoto = imageUploader.single('photo');

/**
 *
 */
const updateProfile = catchAsync(async (req, res, next) => {
	// Return Error If user post password
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This route iis not for password update', 400));
	}

	try {
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				transformation: [
					{
						width: 300,
						height: 300,
						gravity: 'auto',
						crop: 'fill',
					},
				],
			});

			// 2) Filtered out unwanted fields that are not allowed to be updated
			const filteredBody = filterObj(req.body, 'firstname', 'lastname');
			if (req.file) filteredBody.photo = result.secure_url;
			const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
				new: true,
				runValidators: true,
			});

			res.status(200).json({
				status: 'success',
				user: updatedUser,
			});
		} else {
			const filteredBody = filterObj(req.body, 'firstname', 'lastname');
			const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
				new: true,
				runValidators: true,
			});

			res.status(200).json({
				status: 'success',
				user: updatedUser,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns user
 */
const getProfile = catchAsync(async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

module.exports = { uploadPhoto, updateProfile, getProfile };
