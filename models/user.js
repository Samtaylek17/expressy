const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			trim: true,
			required: [true, 'Firstname field is required'],
		},
		lastname: {
			type: String,
			trim: true,
			required: [true, 'Lastname is required'],
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			trim: true,
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		photo: {
			type: String,
		},
		password: {
			type: String,
			required: [true, 'Please provide your password'],
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords are not the same',
			},
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		emailVerifyToken: String,
		emailVerifyExpires: Date,
    joinedDate: Date,
    lastSeen: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.pre('save', async function (next) {
	// This function runs when the password is modified
	if (!this.isModified('password')) return next();

	// Hashing the password with a cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
