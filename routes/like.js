const express = require('express');
const { protect } = require('../controllers/auth');
const { addLike, removeLike } = require('../controllers/like');

const router = express.Router();

router.post('/:postId/like-post', protect, addLike);
router.post('/:postId/unlike-post', protect, removeLike);

module.exports = router;
