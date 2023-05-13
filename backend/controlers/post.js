const db = require("../db");
const passport = require("passport");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("node:path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

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

exports.create_post = [
  passport.authenticate("jwt", { session: false }),
  body("title").escape(),
  body("content").trim().escape(),
  body("price")
    .escape()
    // .custom(value => !value ? false : true)
    // .withMessage("السعر لا يمكن أن يكون فارغ")
    .customSanitizer((value) => {
      return +value;
    })
    .isNumeric()
    .withMessage("السعر يجب ان يكون رقم")
    .trim(),
  body("categories").escape().trim(),

  upload.single("image"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors,
        });
      } else {
        const postdetails = [
          req.user,
          req.body.title,
          req.body.content,
          req.body.price,
          new Date(),
          req.file.path.replace(/\\/g, "/"),
        ];
        await queryDb(
          "INSERT INTO posts (authorid, title, content, price, createddate, image) VALUES(?,?,?,?,?,?)",
          postdetails
        );
        let categories = [];
        if (req.body.categories) {
          categories = await Promise.all(
            req.body.categories.split(",").map(async (cat) => {
              const result = await queryDb(
                "SELECT id from categories where name = ? ",
                cat
              );
              return result[0].id;
            })
            );
            categories = new Set(categories);
          const post = await queryDb('SELECT * FROM posts WHERE title = ?', req.body.title);
          await Promise.all(
            Array.from(categories).forEach(async e => {
              await queryDb('INSERT INTO post_categories (postid, categoryid) VALUES (?, ?)', [post[0].id, e]);
            })
          );
        }
        console.log(categories);
        res.status(200).json({
          msg: "تم انشاء منشور بنجاح",
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
