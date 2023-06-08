const express = require("express");
const router = express.Router();
const user_controler = require("../controlers/user");

router.post("/signup", user_controler.user_signup);
router.post("/login", user_controler.user_login);
router.post('/cart', user_controler.add_to_cart);
router.delete('/cart', user_controler.remove_from_cart);
router.get('/cart', user_controler.get_cart_items);
router.get('/', user_controler.get_profile);
router.put('/', user_controler.edit_user_profile);
router.put('/password',  user_controler.change_user_password);
router.delete('/', user_controler.delete_user);
module.exports = router;
