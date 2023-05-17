const express = require("express");
const router = express.Router();
const user_controler = require("../controlers/user");

router.post("/signup", user_controler.user_signup);
router.post("/login", user_controler.user_login);
router.post('/logout', user_controler.user_logout);
router.post('/cart', user_controler.add_to_cart);
router.post('/photo', user_controler.add_profile_photo);
router.delete('/cart', user_controler.remove_from_cart);
router.get('/cart', user_controler.get_cart_items);
router.get('/profile', user_controler.get_profile);
router.delete('/', user_controler.delete_user);
module.exports = router;
