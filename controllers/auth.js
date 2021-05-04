const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const config = require('../config/config');
const User = require('../models/user');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');
const Email = require('../utils/email');

const signToken = (id) => {
	return jwt.sign({ id }, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res, next) => {
	const token = signToken(user.id);

	const cookieOptions = {
		expires: new Date(Date.now() + config.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (config.NODE_ENV === 'production') {
		cookieOptions.secure = true;
		// req.secure || req.headers('x-forwarded-proto') === 'https';
	}

	res.cookie('jwt', token, cookieOptions);

	// Remove password field from output after creating user
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		user,
	});
};

const signup = catchAsync(async (req, res, next) => {
	req.body.joinedDate = Date.now();
	req.body.lastSeen = Date.now();

	const user = await User.create(req.body);

	// Send welcome
	const url = `${req.protocol}://${req.get('host')}`;

	await new Email(user, url).sendWelcome();
	createSendToken(user, 201, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Check if email and password exists
	if (!email || !password) {
		return next(new AppError('Please provide your email and password', 400));
	}

	// Check if user exists && password is correct
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// Update Last Seen Field
	const lastSeen = Date.now();
	await User.findByIdAndUpdate(user.id, { lastSeen });

	createSendToken(user, 200, res);
});

// Logout
const logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

const protect = catchAsync(async (req, res, next) => {
	// Get token and check if user exist
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError('You are not logged in! Please log in to access.', 401));
	}

	// Verify token
	const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

	// Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token no longer exist.', 401));
	}

	//  Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('You recently changed password! Please log in again', 401));
	}

	// GRANT ACCESS TO PROTECTED ROUTES
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
	// Get user based on posted email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no such user with that email address.', 404));
	}

	// Generate the random reset token
	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	// Send it to user's email
	try {
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
		await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email. Try again later!', 500));
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	// Get user based on token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

	// If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	// Update changedPasswordAt property for the user ...Done in user Model as a pre middleware

	// Log the user in, send JWT
	createSendToken(user, 201, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
	// Get user from collection
	const user = await User.findById(req.user.id).select('+password');

	// Check if posted password is correct
	if (!user || !(await user.correctPassword(req.body.currentPassword, user.password))) {
		return next(new AppError('Your current password is wrong!', 401));
	}

	// If correct, update password

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	// Log User in, send JWT
	createSendToken(user, 201, res);
});

module.exports = { signup, login, logout, protect, forgotPassword, resetPassword, updatePassword };
