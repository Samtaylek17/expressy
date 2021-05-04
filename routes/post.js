const express = require('express');
const { protect } = require('../controllers/auth');
const { uploadMedia, createPost, getAllPosts, getSinglePost, updatePost, deletePost } = require('../controllers/post');
const { addComment, getPostComments, getComment } = require('../controllers/comment');
const { addLike, removeLike } = require('../controllers/like');

const router = express.Router();

router.post('/new', protect, uploadMedia, createPost);
router.get('/', protect, getAllPosts);
router.get('/:postId', protect, getSinglePost);
router.patch('/:postId', protect, uploadMedia, updatePost);
router.delete('/:postId', protect, deletePost);

// Comments
router.post('/:postId/add-comment', protect, uploadMedia, addComment);
router.get('/:postId/comments', protect, getPostComments);
router.get('/:postId/:commentId', protect, getComment);

module.exports = router;
