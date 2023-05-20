const express = require("express");
const session = require("express-session");
const app = express();
const passport = require("passport");
const MySqlStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const helmet = require('helmet');
const db = require("./db");
require("dotenv").config();
require('./passport')

app.use(helmet());
app.use(bodyParser.json());
const sessionStore = new MySqlStore({}, db);
app.use(
  session({
    secret: process.env.SECRET || 'adjfadjfq@#$!#$%@$',
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("<h1> hello world! </h1>");
});
app.use('/images',express.static('uploads'));
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
app.use("/user", userRouter);
app.use("/posts", postRouter);

app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.message)
  // Log to file 
}) 
app.use((err, req, res, next) => { 
  console.log(err);
  return res.status(500).json({
    msg: "حصل خطاء في السيرفر",
  });
})