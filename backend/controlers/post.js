const db = require("../db");
const passport = require("passport");
const multer = require("multer");
const { query, body, validationResult } = require("express-validator");
const path = require("path");
const { queryDb } = require("../utils");
const { authenticate } = require("passport");


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
        let query =
          "INSERT INTO posts (authorid, title, content, price, createddate";
          query += ") VALUES (?,?,?,?,?)";
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
  body("postid").escape(),
  body("title").escape(),
  body("content").escape(),
  body("price").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const post = await queryDb(
      "SELECT * FROM posts WHERE id = ? And authorid = ?",
      [req.body.postid, req.user]
    );
    if (post.length > 0) {
      const postdetails = [];
      let query = `UPDATE posts SET `;
      if (req.body.title) {
        postdetails.push(req.body.title);
        query += ` title = ? ,`;
      }
      if (req.body.content) {
        postdetails.push(req.body.content);
        query += ` content = ?,`;
      }
      if (req.body.price) {
        postdetails.push(+req.body.price);
        query += ` price = ?,`;
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
      postdetails.push(new Date());
      postdetails.push(req.body.postid);
      postdetails.push(req.user);
      query += " createddate = ? WHERE id = ? and authorid = ? ";
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
    } else {
      return res.status(404).json({
        msg: "عذرا لم يتم العثور على المنشور",
      });
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

  async (req, res, next) => {
    try {
      const query = `
      SELECT 
      p.id AS postid, 
      p.title, 
      p.content, 
      p.likes_count,
      p.price, 
      p.createddate, 
      p.image,
      p.author_name AS author,
      CONCAT(u.firstname,  " ", u.lastname) AS username,
      IF(pl.user_id = u.id, true, false) AS isLiked,          
      GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories
      FROM posts AS p
      INNER JOIN users AS u ON p.userid = u.id
      INNER JOIN post_categories AS pc ON pc.postid = p.id 
      INNER JOIN categories AS c ON c.id = pc.categoryid
      LEFT JOIN post_likes AS pl ON pl.user_id = u.id
      GROUP BY p.id
      ORDER BY p.createddate DESC;`;
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
      SELECT 
      p.id AS postid, 
      p.title, 
      p.author_name AS author,
      CONCAT(u.firstname, " ", u.lastname) AS username,
      p.content, 
      p.likes_count,
      p.price, 
      p.createddate, 
      p.image,
      IF(pl.user_id = u.id, true, false) AS isLiked,          
      GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories
    FROM posts AS p
    INNER JOIN users AS u ON p.userid = u.id
    INNER JOIN post_categories AS pc ON pc.postid = p.id 
    INNER JOIN categories AS c ON c.id = pc.categoryid
    LEFT JOIN post_likes AS pl ON pl.user_id = u.id
    GROUP BY p.id;
  WHERE p.id = ?
  `;

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

exports.get_categories = [
  async (req, res, next) => {
    try {
      const categoires = await queryDb("SELECT * FROM categories ");
      return res.status(200).json({
        categoires: categoires,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];


exports.search_post = [
  query('category')
  .escape(),
  query('title')
  .escape(),
  query('author')
  .escape(),
  async (req, res, next) => { 
    let query = `
    SELECT 
    p.id AS postid, 
    p.title, 
    p.author_name AS author,
    CONCAT(u.firstname, " ", u.lastname) AS username,
    p.content, 
    p.likes_count,
    p.price, 
    p.createddate, 
    p.image,
    IF(pl.user_id = u.id, true, false) AS isLiked,          
    GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories
    FROM posts AS p
    INNER JOIN users AS u ON p.userid = u.id
    INNER JOIN post_categories AS pc ON pc.postid = p.id 
    INNER JOIN categories AS c ON c.id = pc.categoryid
    LEFT JOIN post_likes AS pl ON pl.user_id = u.id
    WHERE `;
  let whereClause = [];
  if(req.query.category) { 
    whereClause.push(`pc.categoryid="${req.query.category}"`);
  }
  if(req.query.author) { 
    whereClause.push(`p.author_name LIKE "%${req.query.author}%"`);
  }
  if(req.query.title) { 
    whereClause.push(`p.title LIKE "%${req.query.title}%"`);
  }


  if(whereClause.length > 0) { 
    query += whereClause.join(' AND ');
  }
  else { 
    return res.status(400).json({
      msg: "لايوجد فلاتر للبحث",
    });
  }
  try{
    query += ' GROUP BY p.id;';
    const posts = await queryDb(query);
    if(posts.length > 0) { 
      return res.status(200).json({
        posts,
      });
    }
    else { 
      return res.status(404).json({
        msg: 'لايوجد منشورات لعرضها',
      });
    }
  }
  catch(err) { 
    console.log(err);
    next(err);
  }
}];

exports.search_auth_post = [
  passport.authenticate('jwt', {session: false}),
  query('like')
  .escape(),
  query('myposts')
  .escape(),
  async (req, res, next) => { 
    let query = `
    SELECT 
    p.id AS postid, 
    p.title, 
    p.author_name AS author,
    CONCAT(u.firstname, " ", u.lastname) AS username,
    p.content, 
    p.likes_count,
    p.price, 
    p.createddate, 
    p.image,
    IF(pl.user_id = u.id, true, false) AS isLiked,          
    GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories
    FROM posts AS p
    INNER JOIN users AS u ON p.userid = u.id
    INNER JOIN post_categories AS pc ON pc.postid = p.id 
    INNER JOIN categories AS c ON c.id = pc.categoryid
    LEFT JOIN post_likes AS pl ON pl.user_id = u.id
    WHERE `;  
  let whereClause = [];
    if(req.query.like && req.user) { 
      whereClause.push("pl.user_id= " + req.user);
    }
    if(req.query.myposts && req.user) { 
      whereClause.push("p.userid=" + req.user);
    }

    if(whereClause.length > 0) { 
      query += whereClause.join(' AND ');
    }
    else { 
      return res.status(400).json({
        msg: "لايوجد فلاتر للبحث",
      });
    }
    try{
      query += ' GROUP BY p.id;';
      const posts = await queryDb(query);
      if(posts.length > 0) { 
        return res.status(200).json({
          posts,
        });
      }
      else { 
        return res.status(404).json({
          msg: 'لايوجد منشورات لعرضها',
        });
      }
    }
    catch(err) { 
      console.log(err);
      next(err);
    }
  }
];