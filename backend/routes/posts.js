const express = require('express');
const router = express.Router();
const post_controler = require('../controlers/post');

router.post('/post', post_controler.create_post);
router.put('/post', post_controler.edit_post);
router.delete('/post', post_controler.delete_post);
router.get('/', post_controler.get_posts);
router.get('/post', post_controler.get_post);
router.post('/post/likes', post_controler.add_like);
router.get('/categories', post_controler.get_categories);
router.get('/search', post_controler.search_post);
module.exports= router;