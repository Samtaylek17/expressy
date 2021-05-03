const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		body: {
			type: String,
			required: [true, 'Comment cannot be empty'],
		},
		media: {
			type: String,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		postedOn: {
			type: Date,
		},
		createdAt: {
			type: Date,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
