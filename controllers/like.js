const Like = require('../models/like');
const Post = require('../models/post');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');

const addLike = catchAsync(async (req, res, next) => {
	try {
		const existing_post = await Post.findById(req.params.postId);
		if (!existing_post) {
			return next(new AppError('No Post found with that ID', 404));
		}

		// Check if user already liked post
		const like_exist = await Like.findOne({ likedBy: req.user.id, post: req.params.postId });

		if (like_exist) {
			return next(new AppError('You already liked this post', 400));
		}

		req.body.like = 1;
		req.body.likedBy = req.user.id;
		req.body.post = req.params.postId;
		req.body.createdAt = Date.now();

		// Get current number of likes and increment by like count
		const like = await Like.create(req.body);

		const post = await Post.findByIdAndUpdate(
			req.params.postId,
			{ $push: { likes: like } },
			{ new: true, runValidators: true }
		);

		res.status(201).json({
			status: 'success',
			like,
			post,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const removeLike = catchAsync(async (req, res, next) => {
	try {
		const existing_post = await Post.findById(req.params.postId);
		if (!existing_post) {
			return next(new AppError('No Post found with that ID', 404));
		}

		const like = await Like.findOne({ likedBy: req.user.id, post: req.params.postId });
		if (!like) {
			return next(new AppError('You have not liked this post yet', 404));
		}

		await Post.findByIdAndUpdate(req.params.postId, { $pull: { likes: like.id } }, { new: true, runValidators: true });
		await Like.findOneAndDelete({ post: req.params.postId, likedBy: req.user.id });

		res.status(204).json({
			status: 'success',
			like: null,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

module.exports = { addLike, removeLike };
