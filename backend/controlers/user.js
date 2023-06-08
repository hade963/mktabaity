const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { queryDb } = require("../utils");
const path = require("path");

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

  async (req, res, next) => {
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
      next(err);
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
  async (req, res, next) => {
    if(req.headers.authorization) { 
      let decoded;
      try {
        decoded = jwt.verify(req.headers.authorization.split('Bearer ').join(''), process.env.SECRET);
        const user = await queryDb('SELECT * FROM users WHERE id = ?', decoded.id);
        if (user.length > 0) {
          return res.status(400).json({
            msg: "تم تسجيل الدخول بالفعل",
          });
        }
      }
      catch(err) { 
        return res.status(400).json({
          msg: 'حدث خطاء انثاء التسجيل  المعلومات غير صحيحة',
        });
      }
    }
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
        if (isPasswordCorrect) {
          const token = jwt.sign(
            { id: result[0].id, username: result[0].username },
            process.env.SECRET,
            { expiresIn: "1d" }
            );
            return res.status(200).json({
              msg: "تم تسجيل الدخول ",
              token: token,
            });
          } else {
            return res.status(400).json({
              msg: "كلمة المرور أو اسم المستخدم خاطئ",
            });
          }
        } catch (err) {
          console.error(err);
          next(err);
        }
  },
];

exports.add_to_cart = [
  passport.authenticate("jwt", { session: false }),
  body("postid")
    .custom((value) => {
      return value ? true : false;
    })
    .withMessage("معرف المنشور غير صالح")
    .escape(),
  body("quantity")
    .custom((value) => {
      return value ? true : false;
    })
    .withMessage("الكمية لا يجب أن تكون فارغة")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const post = await queryDb(
      "SELECT * FROM posts WHERE id = ? ",
      req.body.postid
    );
    if (post.length > 0) {
      try {
        const item = await queryDb(
          "SELECT * FROM cart WHERE postid = ? AND userid = ?",
          [req.body.postid, req.user]
        );
        if (item.length > 0) {
          return res.status(409).json({
            msg: "العنصر موجود في السلة بالفعل",
          });
        }
        await queryDb(
          `INSERT INTO cart (userid, postid, quantity) VALUES (?, ?, ?)`,
          [req.user, req.body.postid, req.body.quantity]
        );
        res.status(200).json({
          msg: "تم اضافة السلعة الى السلة بنجاح",
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
    } else {
      return res.status(404).json({
        msg: "لم يتم العثور على المنشور المطلوب",
      });
    }
  },
];

exports.remove_from_cart = [
  passport.authenticate("jwt", { session: false }),
  body("postid")
    .escape()
    .custom((value) => {
      return value ? true : false;
    })
    .withMessage("معرف المنشور غير صالح"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const item = await queryDb(
        "SELECT * FROM cart WHERE postid = ? AND userid = ?",
        [req.body.postid, req.user]
      );
      if (item.length > 0) {
        await queryDb("DELETE FROM cart WHERE postid = ? AND userid = ?", [
          req.body.postid,
          req.user,
        ]);
        res.status(200).json({
          msg: "تم حذف العنصر من السلة",
        });
      } else {
        res.status(404).json({
          msg: "لا يوجد شيء ليتم حذفه",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.get_cart_items = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const query = `
      SELECT c.quantity, c.id AS cart_id, p.title, p.content,
      p.price *c.quantity AS final_price,p.price AS price_for_unit ,p.image, p.id AS postid   FROM cart AS c
      INNER JOIN posts As p ON c.postid = p.id WHERE c.userid = ?;`;

      const itemsInCart = await queryDb(query, [req.user]);
      if (itemsInCart.length > 0) {
        return res.status(200).json({
          items: itemsInCart,
        });
      } else {
        return res.status(404).json({
          msg: "لا يوجد عناصر في السلة لعرضها ",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.get_profile = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = await queryDb(
        "SELECT firstname, lastname, username, email, phoneNumber, photo from users WHERE id = ?",
        [req.user]
      );

      if (user.length > 0) {
        return res.status(200).json({
          user: user[0],
        });
      } else {
        return res.status(404).json({
          msg: "المستخدم غير موجود",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];


exports.delete_user = [
  passport.authenticate("jwt", { session: false }),
  body("username").escape(),
  async (req, res, next) => {
    try {
      if (req.body.username) {
        req.session.destroy();
        await queryDb("DELETE  FROM users WHERE id = ? AND username = ?", [
          req.user,
          req.body.username,
        ]);
        res.status(200).json({
          msg: "تم حذف المستخدم بنجاح",
        });
      } else {
        res.status(400).json({
          msg: "اسم المستخدم غير موجود يرجى ادخاله والمحاولة لاحقا",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.edit_user_profile = [
  passport.authenticate("jwt", { session: false }),
  body("email")
    .trim()
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
  body("phonenumber").escape().trim(),
  body("username")
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
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      let query = "UPDATE users SET ";
      let details = [];
      if (req.body.username && req.body.username.length > 2) {
        query += "username = ?";
        details.push(req.body.username);
      }
      if (req.body.email) {
        query += ", email = ?";
        details.push(req.body.email);
      }
      if (req.body.phonenumber) {
        query += ", phonenumber = ?";
        details.push(req.body.phonnumber);
      }
      if (details.length > 0) {
        query += " WHERE id = ?";
        details.push(req.user);
        await queryDb(query, details);
        res.status(200).json({
          msg: "تم تعديل الملف الشخصي بنجاح",
        });
      } else {
        res.status(400).json({
          msg: "لايوجد شيء ليتم تعديله",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.change_user_password = [
  passport.authenticate("jwt", { session: false }),
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
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const hash = bcrypt.hashSync(req.body.password);
      await queryDb("UPDATE users SET password = ? WHERE id = ?", [
        req.body.password,
        req.user,
      ]);
      res.status(200).json({
        msg: "تم تغير كلمة السر بنجاح",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];
