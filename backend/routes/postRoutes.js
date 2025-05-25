const express = require('express');
const router = express.Router();
const { createPost,getPosts,reactToPost,replyToPost } = require('../controllers/postController');

router.post('/create', createPost);
router.get('/', getPosts);
router.post('/:id/react', reactToPost);
router.post('/:id/reply', replyToPost);

module.exports = router;
