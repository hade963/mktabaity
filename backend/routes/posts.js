const express = require('express');
const router = express.Router();
const post_controler = require('../controlers/post');

router.post('/post', post_controler.create_post);
router.post('/post/likes', post_controler.add_like);
router.put('/post', post_controler.edit_post);
router.get('/', post_controler.get_posts);
router.get('/post', post_controler.get_post);
router.delete('/post', post_controler.delete_post);
module.exports= router;