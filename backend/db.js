const mysql = require('mysql');
require('dotenv').config();

let connection;
if(process.env.NODE_ENV === 'production') { 
  connection = mysql.createPool(process.env.db_connection_url);
  
  
}

connection.on("error", (err)=> { 
  console.error('MYSQL connection error' + err);
});
connection.on('connection', function (connection) {
  console.log('db connected');
});
module.exports = connection;
