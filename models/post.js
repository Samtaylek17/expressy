const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true],
		},
		body: {
			type: String,
			required: [true, 'Post cannot be empty'],
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
			default: Date.now(),
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Like',
			},
		],
		createdAt: {
			type: Date,
		},
		updatedAt: {
			type: Date,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

postSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'postedBy',
		select: '-__v',
	});
	next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
