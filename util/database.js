// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host:'localhost',
//   user:'root',
//   password:'hikaru@t18ac019',
//   database:'node-complete',
// });

// module.exports = pool.promise();

//>>>>>>  sequelizeは裏でmysql2を使用する。

//以下 sequelize使用

const Sequelize = require('sequelize');

//using connection pool
const sequelize = new Sequelize('node-complete','root','hikaru@t18ac019',{
  host:'localhost',
  dialect:'mysql'
});

module.exports = sequelize;