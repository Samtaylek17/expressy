const express = require('express');
const { protect } = require('../controllers/auth');
const { uploadMedia, createPost, getAllPosts, getSinglePost, updatePost, deletePost } = require('../controllers/post');

const router = express.Router();

router.post('/new', protect, uploadMedia, createPost);
router.get('/', protect, getAllPosts);
router.get('/:postId', protect, getSinglePost);
router.patch('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);

module.exports = router;
