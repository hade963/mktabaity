const express = require("express");
const router = express.Router();
const user_controler = require("../controlers/user");

router.post("/signup", user_controler.user_signup);
router.post("/login", user_controler.user_login);
router.post('/logout', user_controler.user_logout);


module.exports = router;
