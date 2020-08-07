const mysql = require('mysql2');

const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'hikaru@t18ac019',
  database:'node-complete',
});

module.exports = pool.promise();