const mysql = require('mysql');
require('dotenv').config();

let connection;
if(process.env.NODE_ENV = 'production') { 
  connection = mysql.createPool({
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
  
}
else { 
  connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.tdb_host,
    user: process.env.tdb_user,
    password: process.env.tdb_pass,
    port: process.env.tdb_port,
    database: process.env.tdb_name,
  });
  
  connection.on("error", (err)=> { 
    console.error('MYSQL connection error' + err);
  });
  
}
module.exports = connection;