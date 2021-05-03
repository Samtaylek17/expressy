const cloudinary = require('cloudinary').v2;
const Post = require('../models/post');
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

const createPost = catchAsync(async (req, res, next) => {
	const { title, body } = req.body;

	try {
		if (!title || !body) {
			return next(new AppError('Please fill the required fields', 400));
		}

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });

			req.body.media = result.secure_url;
			req.body.postedBy = req.user.id;
			req.body.postedOn = Date.now();
			req.body.createdAt = Date.now();

			const post = await Post.create(req.body);
			res.status(201).json({
				status: 'success',
				post,
			});
		} else {
			req.body.postedBy = req.user.id;
			req.body.postedOn = Date.now();
			req.body.createdAt = Date.now();

			const post = await Post.create(req.body);
			res.status(201).json({
				status: 'success',
				post,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const getAllPosts = catchAsync(async (req, res, next) => {
	try {
		let filter = {};
		if (req.params.postId) {
			filter = { post: req.params.postId };
		}
		const features = new APIFeatures(Post.find(filter), req.query).filter().sort().limitFields().paginate();

		const post = await features.query;

		res.status(200).json({
			status: 'success',
			results: post.length,
			post,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const getSinglePost = catchAsync(async (req, res, next) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);

		if (!post) {
			return next(new AppError('No Post found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			post,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const updatePost = catchAsync(async (req, res, next) => {
	try {
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });

			req.body.media = result.secure_url;

			const post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
				new: true, //to return just the updated field
				runValidators: true, // run validators again
			});

			res.status(200).json({
				status: 'success',
				post,
			});
		} else {
			const post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
				new: true, //to return just the updated field
				runValidators: true, // run validators again
			});

			if (!post) {
				return next(new AppError('No post found with that ID', 404));
			}

			res.status(200).json({
				status: 'success',
				post,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

const deletePost = catchAsync(async (req, res, next) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.postId);

		if (!post) {
			return next(new AppError('No post found with that ID', 404));
		}

		res.status(204).json({
			status: 'success',
			post: null,
		});
	} catch (error) {
		res.status(500).json({
			error: error.toString(),
		});
	}
});

module.exports = { uploadMedia, createPost, getAllPosts, getSinglePost, updatePost, deletePost };
