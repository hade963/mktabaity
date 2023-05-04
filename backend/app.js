const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.db_connection);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting to the database'));


app.use(session({
  secret: process.env.SECRET,
  cookie: {httpOnly: true, maxAge: 24 * 60 * 60 * 1000},
  resave: false,
  saveUninitialized: true,
}
))
app.get('/', (req, res ) => { 
  res.send('<h1> hello world! </h1>');
});

const server = app.listen(3000, () => {
  let host = server.address().address;
  console.info(`server started on port ${host}`);
});