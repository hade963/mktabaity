const db = require("../db");
const passport = require("passport");
const multer = require("multer");
const { query, body, validationResult } = require("express-validator");
const path = require("path");
const { queryDb } = require("../utils");
const fs = require("@cyclic.sh/s3fs");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

exports.create_post = [
  passport.authenticate("jwt", { session: false }),
  body("title").escape(),
  body("content").trim().escape(),
  body("price")
    .escape()
    .customSanitizer((value) => {
      return +value;
    })
    .isNumeric()
    .withMessage("السعر يجب ان يكون رقم")
    .trim(),
  body("categories").escape().trim(),

  upload.single("image"),
  async (req, res, next) => {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors,
        });
      } else {
        
        const createdDate = new Date();
        const year = createdDate.getFullYear();
        const month = `${createdDate.getMonth() + 1}`.padStart(2, "0");
        const day = `${createdDate.getDate()}`.padStart(2, "0");

        // get the hours, minutes, and seconds as separate strings
        const hours = `${createdDate.getHours()}`.padStart(2, "0");
        const minutes = `${createdDate.getMinutes()}`.padStart(2, "0");
        const seconds = `${createdDate.getSeconds()}`.padStart(2, "0");

        // combine the createdDate and time strings into a single string in the desired format
        const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const postdetails = [
          req.user,
          req.body.title,
          req.body.content,
          req.body.price,
          dateTimeString,
        ];
        const imageRegEx = /\.(gif|jpe?g|jfif|tiff?|png|webp|bmp)$/i;
        let query =
          "INSERT INTO posts (authorid, title, content, price, createddate";
        if (req.file && imageRegEx.test(req.file.filename)) {
          postdetails.push(req.file.path.replace(/\\/g, "/"));
          query += ",image) VALUES (?,?,?,?,?,?)";
          fs.writeFile(req.file.filename, req.file.buffer, function(err) {
            if (err) {
              console.error(err);
              return res.status(500).send('Error uploading file');
            }
          });
        } else {
          query += ") VALUES (?,?,?,?,?)";
        }
        await queryDb(query, postdetails);

        let categories = [];
        if (req.body.categories) {
          categories = await Promise.all(
            req.body.categories.split(",").map(async (cat) => {
              const result = await queryDb(
                "SELECT id from categories where name = ?",
                cat
              );
              const r = result[0];
              return r.id;
            })
          );
          const post = await queryDb(
            "SELECT * FROM posts WHERE title = ? AND authorid = ? AND createddate LIKE ?",
            [req.body.title, req.user, dateTimeString]
          );
          categories.forEach(async (e) => {
            await queryDb(
              "INSERT INTO post_categories (postid, categoryid) VALUES (?, ?)",
              [post[0].id, e]
            );
          });
        }

        res.status(200).json({
          msg: "تم انشاء منشور بنجاح",
        });
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

exports.edit_post = [
  passport.authenticate("jwt", { session: false }),
  body("postid")
    .escape()
    .isNumeric()
    .withMessage("معرف المنشور يجب أن يكون رقم"),
  body("title").escape(),
  body("content").escape(),
  body("price").isNumeric(),
  upload.single("image"),
  async (req, res, next) => {
    const postdetails = [];
    let query = `UPDATE posts SET `;
    if (req.body.title) {
      postdetails.push(req.body.title);
      query += ` title = ?`;
    }
    if (req.body.content) {
      postdetails.push(req.body.content);
      query += `, content = ?`;
    }
    if (req.body.price) {
      postdetails.push(+req.body.price);
      query += `, price = ?`;
    }
    let categories = [];
    if (req.body.categories) {
      categories = await Promise.all(
        req.body.categories.split(",").map(async (cat) => {
          const result = await queryDb(
            "SELECT id from categories where name LIKE ?",
            `${cat}`
          );
          return result[0].id;
        })
      );
      await queryDb(
        "DELETE FROM post_categories WHERE postid = ?",
        req.body.postid
      );
      categories.forEach(async (cat) => {
        await queryDb(
          "INSERT INTO post_categories (postid, categoryid) VALUES (?, ?)",
          [req.body.postid, cat]
        );
      });
    }
    const imageRegEx = /\.(gif|jpe?g|jfif|tiff?|png|webp|bmp)$/i;
    if (req.file && imageRegEx.test(req.file.filename)) {
      postdetails.push(req.file.path.replace(/\\/g, "/"));
      query += ", image = ?";
      fs.writeFile(req.file.filename, req.file.buffer, function(err) {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading file');
        }
      });
    }
    postdetails.push(new Date());
    postdetails.push(req.body.postid);
    postdetails.push(req.user);
    query += ", createddate = ? WHERE id = ? and authorid = ? ";
    try {
      const post = await queryDb(
        "SELECT authorid FROM posts WHERE id = ? ",
        req.body.postid
      );
      await queryDb(query, postdetails);
      return res.status(200).json({
        msg: "تم تحديث المنشور بنجاح",
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

exports.add_like = [
  passport.authenticate("jwt", { session: false }),
  body("postid").custom(async (value) => {
    const result = await queryDb("SELECT * FROM posts WHERE id = ?", [value]);
    if (result) {
      return true;
    } else {
      throw new Error("معرف المنشور غير موجود");
    }
  }),
  async (req, res, next) => {
    try {
      const post = await queryDb(
        "SELECT  * FROM posts WHERE id = ? AND authorid = ?",
        [req.body.postid, req.user]
      );
      if (post.length > 0) {
        const result = await queryDb(
          "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?",
          [req.user, +req.body.postid]
        );
        if (result.length > 0) {
          await queryDb(
            "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?",
            [req.user, +req.body.postid]
          );
          await queryDb(
            "UPDATE posts SET likes_count = likes_count -1 WHERE authorid = ? AND id = ?",
            [req.user, +req.body.postid]
          );
          return res.status(200).json({
            msg: "تم الغاء الاعجاب بالمنشور بنجاح",
          });
        } else {
          await queryDb(
            "INSERT INTO post_likes (user_id, post_id) VALUES(?,?)",
            [req.user, +req.body.postid]
          );
          await queryDb(
            "UPDATE posts SET likes_count = likes_count + 1 WHERE authorid = ? AND id = ?",
            [req.user, +req.body.postid]
          );
          return res.status(200).json({
            msg: "تم الاعجاب بالمنشور بنجاح",
          });
        }
      } else {
        res.status(404).json("لم يتم العثور على المنشور المطلوب");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

exports.get_posts = [
  passport.authenticate("jwt", { session: false }),
  query("page").escape(),
  async (req, res, next) => {
    try {
      const query = `SELECT p.id AS postid, p.title, p.content, p.likes_count,
      p.price, p.createddate, p.image, p.likes_count, CONCAT(u.firstname, ' ', u.lastname) AS authorname,
      GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories
      FROM posts AS p
      INNER JOIN users AS u ON p.authorid = u.id
      INNER JOIN post_categories AS pc ON pc.postid = p.id
      INNER JOIN categories AS c ON c.id = pc.categoryid
      GROUP BY p.id
      ORDER BY p.createddate DESC
      LIMIT 10 OFFSET ${req.query.page > 0 ? req.query.page * 10 : 0};`;
      const posts = await queryDb(query);
      if (posts.length > 0) {
        return res.status(200).json({
          posts: posts,
        });
      } else {
        return res.status(404).json({
          msg: "الصفحة غير موجودة",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.get_post = [
  passport.authenticate("jwt", { session: false }),
  query("postid")
    .escape()
    .notEmpty()
    .withMessage("معرف المنشور لا يمكن أن يكون فارغا"),
  async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
      }

      const query = `
      SELECT  p.title, p.content, p.price, p.image,
      p.likes_count, p.createddate, CONCAT(u.firstname, ' ', u.lastname) AS authorname, 
      u.phonenumber, u.photo FROM posts AS p
      INNER JOIN users AS  u ON p.authorid = u.id
      WHERE p.id = ?;`;

      const post = await queryDb(query, req.query.postid);
      if (post.length > 0) {
        res.status(200).json({
          post: post,
        });
      } else {
        res.status(404).json({
          post: "المنشور غير موجود",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.delete_post = [
  passport.authenticate("jwt", { session: false }),
  body("postid").escape(),
  async (req, res, next) => {
    try {
      if (req.body.postid) {
        const post = await queryDb(
          "SELECT * FROM posts WHERE id = ? AND authorid = ?",
          [req.body.postid, req.user]
        );
        if (post.length > 0) {
          await queryDb("DELETE FROM posts WHERE id = ? AND authorid = ?", [
            req.body.postid,
            req.user,
          ]);
          return res.status(200).json({
            msg: "تم حذف المنشور بنجاح",
          });
        } else {
          return res.status(404).json({
            msg: "المنشور غير موجود ",
          });
        }
      } else {
        return res.status(400).json({
          msg: "معرف المنشور غير موجود",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];
