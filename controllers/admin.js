const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');



exports.getAddProduct = (req,res) => {
  
  res.render('admin/edit-product',{
    pageTitle:'Add Product',
    path:'/admin/add-product',
    editing:false,
    hasError:false,
    errorMessage:null,
    validationErrors:[]
  })}



exports.postAddProduct = (req,res,next) => {
  const {title,price,description,imageUrl} = req.body;
  const errors = validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return  res.status(422).render('admin/edit-product',{
      pageTitle:'Add Product',
      path:'/admin/edit-product',
      editing:false,
      hasError:true,
      product:{
        title,
        imageUrl,
        price,
        description
      },
      errorMessage:errors.array()[0].msg,
      validationErrors:errors.array()
    })
  }
    const product = new Product({
      // _id:mongoose.Types.ObjectId('5f3a03755b5e5e48981da287'),
      title,
      price,
      description,
      imageUrl,
      userId:req.user
    });
    product.save()
    .then(result => {
      res.redirect('/admin/products') 
      console.log('Created Product')
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // res.redirect('/500');
      // return  res.status(422).render('admin/edit-product',{
      //   pageTitle:'Add Product',
      //   path:'/admin/edit-product',
      //   editing:false,
      //   hasError:true,
      //   product:{
      //     title,
      //     imageUrl,
      //     price,
      //     description
      //   },
      //   errorMessage:'Database operation faild, please try again.',
      //   validationErrors:[]
      // })
    });
}



exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if(!editMode){
      return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product',{
        pageTitle:'Edit Product',
        path:'/admin/edit-product',
        editing:editMode,
        hasError:false,
        product,
        errorMessage:null,
        validationErrors:[]
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
   }



exports.postEditProduct = (req,res) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return  res.status(422).render('admin/edit-product',{
      pageTitle:'Edit Product',
      path:'/admin/edit-product',
      editing:true,
      hasError:true,
      product:{
        title:updatedTitle,
        imageUrl:updatedImageUrl,
        price:updatedPrice,
        description:updatedDescription,
        _id:productId
      },
      errorMessage:errors.array()[0].msg,
      validationErrors:errors.array()
    })
  }

  Product.findById(productId)
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    product.save()
  })
  .then(() => {
    res.redirect('/admin/products')
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}



exports.getProducts = (req,res) => {

  Product.find({userId:req.user._id})
  .then(products => {
    console.log(products)
    res.render('admin/products',{
    prods:products,
    pageTitle:'Admin/products',
    path:'/admin/products'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};



exports.postDeleteProduct = (req,res) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
  .then(product => {
     console.log('delete');
     res.redirect('/admin/products');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })  
};
  