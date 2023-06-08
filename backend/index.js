const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const db = require("./db");
const cors = require("cors");
require("dotenv").config();
require("./passport");

app.use(cors({ origin: ["http://127.0.0.1:3000", "http://127.0.0.1:5500"], credentials: true }));
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("<h1> hello world! </h1>");
});
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const { queryDb } = require("./utils");
app.use("/user", userRouter);
app.use("/posts", postRouter);

app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.message);
  // Log to file
});
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).json({
    msg: "حصل خطاء في السيرفر",
  });
});

