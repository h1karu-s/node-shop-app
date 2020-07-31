const fs = require('fs');
const path  = require('path');

const p = path.join(__dirname,'../data','/products.json');

//helper function
const getProductsFromFile = (callback) => {

  fs.readFile(p,(err,fileContent) => {
    if(err){
      callback([]);
    }else{
      callback(JSON.parse(fileContent));
    }     
  })
}

//class
module.exports = class Product {
  constructor(title){
    this.title = title;
  }

  save(){
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p,JSON.stringify(products),(err) => {
        console.log(err);
      });

      });
    } 
  

  static fetchAll(callback){
    getProductsFromFile(callback);
  }
}