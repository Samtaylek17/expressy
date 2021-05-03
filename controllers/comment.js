const cloudinary = require('cloudinary').v2;
const Post = require('../models/post');
const Comment = require('../models/comment');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');
const config = require('../config/config');
const APIFeatures = require('../utils/api_features');
const { imageUploader } = require('../utils/image_uploader');

cloudinary.config({
	cloud_name: config.CLOUDINARY_CLOUD_NAME,
	api_key: config.CLOUDINARY_API_KEY,
	api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadMedia = imageUploader.single('media');

const addComment = catchAsync(async (req, res, next) => {
	try {
		if (!req.body.comment) {
			return next(new AppError('Comment cannot be empty', 404));
		}

		// Check if post exist
		const existing_post = await Post.findById(req.params.postId);
		if (!existing_post) {
			return next(new AppError('No Post found with that ID', 404));
		}

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });

			req.body.media = result.secure_url;
			req.body.post = req.params.postId;
			req.body.postedBy = req.user.id;
			req.body.postedOn = Date.now();
			req.body.createdAt = Date.now();

			const comment = await Comment.create(req.body);
			await Post.findByIdAndUpdate(
				req.params.postId,
				{ $push: { comments: comment.id } },
				{ new: true, runValidators: true }
			);

			res.status(201).json({
				status: 'success',
				comment,
			});
		} else {
			req.body.post = req.params.postId;
			req.body.postedBy = req.user.id;
			req.body.postedOn = Date.now();
			req.body.createdAt = Date.now();

			const comment = await Comment.create(req.body);
			await Post.findByIdAndUpdate(
				req.params.postId,
				{ $push: { comments: comment.id } },
				{ new: true, runValidators: true }
			);

			res.status(201).json({
				status: 'success',
				comment,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const getPostComments = catchAsync(async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId);
		if (!post) {
			return next(new AppError('No post found with that ID', 404));
		}

		const comments = await Comment.find({ post: req.params.postId });

		res.status(200).json({
			status: 'success',
			results: comments.length,
			comments,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const getComment = catchAsync(async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);

		if (!comment) {
			return next(new AppError('No Comment found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			comment,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

module.exports = { uploadMedia, addComment, getComment, getPostComments };
