const express = require("express");
const router = express.Router();
const user_controler = require("../controlers/user");

router.post("/signup", user_controler.user_signup);
router.post("/login", user_controler.user_login);
router.post('/logout', user_controler.user_logout);
router.post('/cart', user_controler.add_to_cart);
router.delete('/cart', user_controler.remove_from_cart);
router.get('/cart', user_controler.get_cart_items);
module.exports = router;
