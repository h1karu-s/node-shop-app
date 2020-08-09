const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const MONGODB_URL = process.env.MONGODB_URL;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL)
  .then(client => {
    console.log('Connect');
    callback(client);
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports = mongoConnect;

