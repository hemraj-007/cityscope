const express = require('express');
const router = express.Router();
const { createReply, getReplies } = require('../controllers/replyController');

router.post('/create', createReply);
router.get('/:postId', getReplies);

module.exports = router;
