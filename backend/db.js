const mysql = require('mysql');
const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'maktabati',
});

connection.on("error", (err)=> { 
  console.error('MYSQL connection error' + err);
})
module.exports = connection;