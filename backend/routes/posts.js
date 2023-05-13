const express = require('express');
const router = express.Router();
const post_controler = require('../controlers/post');

router.post('/post', post_controler.create_post);

module.exports= router;