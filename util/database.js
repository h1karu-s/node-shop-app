const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const MONGODB_URL = process.env.MONGODB_URL;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL,{useUnifiedTopology: true})
  .then(client => {
    console.log('Connect');
    _db = client.db()
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDb = () => {   //databaseのインスタンスを取得
  if(_db){
    return _db;
  }
  throw 'No database found!'
};

module.exports = {
  mongoConnect,
  getDb
};

