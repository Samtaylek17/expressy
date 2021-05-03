const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
	{
		like: {
			type: Number,
			default: 0,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: true,
		},
		likedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
