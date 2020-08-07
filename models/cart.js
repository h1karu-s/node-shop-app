const fs = require('fs');
const path = require('path');

const p = path.join(__dirname,'../data','/cart.json');


module.exports = class Cart {
  static addProduct(id,productPrice){
    //Fetch the previous carts
    fs.readFile(p,(err,fileContent) => {
      let cart = {products:[],totalPrice:0};
      if(!err){
        cart = JSON.parse(fileContent);
      }
    //Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //Add new product/ increase quantity
      if(existingProduct){
        updatedProduct = {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      }else{
        updatedProduct = {id:id,qty:1};
        cart.products = [...cart.products,updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + parseInt(productPrice); //文字列から数値へ
      fs.writeFile(p,JSON.stringify(cart),(err) => {
        console.log(err);
      })
    })
    
    
  }


  static deleteProduct(id,productPrice){
    fs.readFile(p,(err,fileContent) => {
      if(err){
        return;
      }
      const updatedCart = {...JSON.parse(fileContent)};
      const product  = updatedCart.products.find(product => product.id === id);
      if(!product){
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p,JSON.stringify(updatedCart),err => {
        console.log(err);
      });

    })
  }


  static getCart(callback){
    fs.readFile(p,(err,fileContent) => {
      if(err){
        callback(null);
      }else{
        const cart = JSON.parse(fileContent);
        callback(cart);
      }
      
    })
  }
}