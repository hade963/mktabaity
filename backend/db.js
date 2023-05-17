const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_pass,
  port: process.env.db_port,
  database: process.env.db_name,
});

connection.on("error", (err)=> { 
  console.error('MYSQL connection error' + err);
});

module.exports = connection;