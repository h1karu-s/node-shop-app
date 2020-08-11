const {getDb} = require('../util/database');
const {ObjectID} = require('mongodb');
const Product = require('./product');
class User {
  constructor(username,email,cart = {items:[]},id){
    this.name = username;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = id;
  }

  save(){
    const db = getDb();
    return db.collection('users').insertOne(this)
  }

  addToCart(product){
    const cartProductIndex = this.cart.items.findIndex(item => {  //既存の製品があるのか調べる
      return  item.productId.toString() === product._id.toString();
    });

    if(cartProductIndex >= 0){  //既存の製品があるならqrantityを+1する
      this.cart.items[cartProductIndex].quantity =  parseInt(this.cart.items[cartProductIndex].quantity) + 1;
    }else{                                              
      this.cart.items.push({productId:product._id,quantity:1});  
    }
    const db = getDb();
    return db.collection('users').updateOne({_id:ObjectID.createFromHexString(this._id)},{$set:{cart:this.cart}});
  }
  
  deleteCartItem(productId){
    const updatedCart = this.cart.items.filter(item => {  
      return item.productId.toString() !== productId;
    })
    this.cart.items = updatedCart;  //インスタンスのcartを変更
    const db = getDb();
    return db.collection('users').updateOne({_id:ObjectID.createFromHexString(this._id)},{$set:{cart:this.cart}});
  }


  getCart(){
   
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    })
    return db.collection('products').find({_id:{$in:productIds}}).toArray()
      .then(products => {
        return products.map(product => {
          const productQuantity = this.cart.items.find(item => {
            return product._id.toString() === item.productId.toString()
          }).quantity;

          return {...product,quantity:productQuantity}
        })
      })
  }

  addOrder(){
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items:products,
        user:{
          _id:ObjectID.createFromHexString(this._id),
          name:this.name
        }
      }
      return db.collection('orders').insertOne(order)
    })
    .then(result => {
        this.cart = {items:[]};
        db.collection('users').updateOne({_id:ObjectID.createFromHexString(this._id)},{$set:{cart:{items:[]}}});
    })
    .catch(err => console.log(err));
    
  }

  getOrders(){
    const db = getDb();
    return db.collection('orders').find({'user._id':ObjectID.createFromHexString(this._id)}).toArray();
  }

  static findById(userId){
    const db = getDb();
    return db.collection('users').findOne({_id:ObjectID.createFromHexString(userId)});
  }
}

module.exports = User;
