const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});


module.exports = mongoose.model('Product',productSchema);





// const {getDb} = require('../util/database');
// const { ObjectID } = require('mongodb');




// class Product {
//   constructor(title,price,imageUrl,description,id,userId){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     if(id){
//       this._id = ObjectID.createFromHexString(id);
//     }
//     this.userId = userId;  
//   }

//   save(){ 
//      const db = getDb();
//      const products = db.collection('products');  // make collection
//      if(this._id){
//        return products.updateOne({_id:this._id},{$set:this})
//       }
//      return products.insertOne(this);
//   };

//   static fetchAll(){
//     const db = getDb();
//     return db.collection('products').find().toArray()  //toArray cursor method
//      .then(products => {
//       //  console.log(products);
//        return products;
//      })
//      .catch(err => console.log(err));
//   }

//   static findById(productId){
//     const db = getDb();
//     return db.collection('products').findOne({_id:ObjectID.createFromHexString(productId)})
//     .then(product => {
//       // console.log(product);
//       return product;
//     })
//     .catch(err => console.log(err));
//   }
  
//   static  update(productId,update){
//     const db = getDb();
//     return db.collection('products').updateOne({_id:ObjectID.createFromHexString(productId)},{$set:update})
     
//   }

//   static deleteById(productId){
//     const db =getDb();
//     return db.collection('products').deleteOne({_id:ObjectID.createFromHexString(productId)});
//   }
// }



// module.exports = Product;