const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Helper function to handle async database queries
const queryDb = async (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.user_signup = [
  body("firstname")
    .isLength({ min: 2 })
    .withMessage("الاسم قصير جدا")
    .escape()
    .trim(),
  body("lastname")
    .isLength({ min: 2 })
    .withMessage("الاسم قصير جدا")
    .escape()
    .trim(),
  body("email")
    .trim()
    .isEmail()
    .escape()
    .custom(async (value) => {
      const result = await queryDb(
        "SELECT * FROM users WHERE email = ?",
        value
      );
      if (result.length > 0) {
        throw new Error("الايميل تم استخدامه بالفعل");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("كلمة السر يجب ان تحتوي 6 احرف على الاقل ")
    .escape()
    .trim()
    .custom((value) => {
      if (!isNaN(value)) {
        throw new Error("كلمة السر يجب ان تحتوي على احرف وارقام");
      }
      return true;
    }),
  body("repassword")
    .escape()
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("كلمة السر غير متطابقة ");
      }
      return true;
    }),
  body("phonenumber")
    .escape()
    .trim()
    .custom(async (value) => {
      const result = await queryDb(
        "SELECT * FROM users WHERE phoneNumber = ?",
        value
      );
      if (result.length > 0) {
        throw new Error("رقم الهاتف تم استخدامه بالفعل");
      }
      const regex = /^(\+?963|0)?9\d{8}$/;
      if (!regex.test(value)) {
        throw new Error("رقم الهاتف غير صالح للاسنخدام");
      }
      return true;
    }),

  body("username")
    .isLength({ min: 2 })
    .withMessage(" اسم المستخدم قصير جدا")
    .custom(async (value) => {
      const result = await queryDb(
        "SELECT * FROM users WHERE username = ?",
        value
      );
      if (result.length > 0) {
        throw new Error("اسم المستخدم موجود بالفعل");
      }
      return true;
    })
    .trim(),

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const hash = await bcrypt.hash(req.body.password, 10);
      const userDetails = [
        req.body.firstname,
        req.body.lastname,
        req.body.username,
        req.body.email,
        req.body.phonenumber,
        hash,
      ];
      await queryDb(
        "INSERT INTO users( firstname, lastname, username, email, phoneNumber, password) VALUES(?,?,?,?,?,?)",
        userDetails
      );

      return res.status(200).json({
        msg: "تم التسجيل بنجاح",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "حصل خطاء في السيرفر",
      });
    }
  },
];

exports.user_login = [
  body("username")
    .trim()
    .escape()
    .custom(async (value) => {
      const result = await queryDb(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [value, value]
      );
      if (result.length === 0) {
        throw new Error("اسم المستخدم أو الايميل غير صالح");
      }
      return true;
    }),
  body("password").escape().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const result = await queryDb(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [req.body.username, req.body.username]
      );

      const hash = result[0].password;
      const isPasswordCorrect = await bcrypt.compare(req.body.password, hash);
        console.log(req.body.password, isPasswordCorrect);
      if (isPasswordCorrect) {
        const token = jwt.sign(
          { id: result[0].id, username: result[0].username },
          process.env.SECRET,
          { expiresIn: "1d" }
        );
        req.session.token = token;
        return res.status(200).json({
          msg: "تم تسجيل الدخول ",
        });
      } else {
        return res.status(400).json({
          msg: "كلمة المرور أو اسم المستخدم خاطئ",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "حصل خطاء في السيرفر",
      });
    }
  },
];

exports.user_logout = [
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      req.session.destroy();
      return res.status(200).json({
        msg: "تم تسجيل الخروج",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "حصل خطاء في السيرفر",
      });
    }
  },
];
