const Product = require('../models/product');
const Cart = require('../models/cart');
const { findById } = require('../models/product');

exports.getProducts = (req,res) => {
    Product.fetchAll()
      .then(([rows,filedData]) => {
        res.render('shop/product-list',{
          prods:rows,
          pageTitle:'All products',
          path:'/products'
        })
      })
      .catch(err => console.log(err));
 };


exports.getProduct = (req,res) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then(([product]) => {
    console.log(product);
    res.render('shop/product-detail',{
      product:product[0],
      pageTitle:product.title,
      path:'/products'
    })
  })
  .catch(err => console.log(err)); 
};


exports.getIndex = (req,res) => {
  Product.fetchAll()
  .then(([rows,filedData]) => {
    res.render('shop/Index',{
      prods:rows,
      pageTitle:'shop',
      path:'/'
  })
  })
  .catch(err => console.log(err));

}


exports.getCart = (req,res) => {
  Cart.getCart(cart => {
    if(!cart){   //cart=nullの場合productsに空の配列を渡す。
      return  res.render('shop/cart',{
        pageTitle:'Your Cart',
        path:'/cart',
        products:[]
      });
    }

    Product.fetchAll(products => {
      const cartProducts =[];
      for(product of products){
        const cartProductData =cart.products.find(prod => prod.id === product.id);
        if(cartProductData){
          cartProducts.push({productData:product,qty:cartProductData.qty});
        }
      }
     res.render('shop/cart',{
        pageTitle:'Your Cart',
        path:'/cart',
        products:cartProducts
      })
    })
  })
  
}

exports.postCart = (req,res) => {
  const productId = req.body.productId;
  Product.findById(productId,(product) => {
    Cart.addProduct(productId,product.price);
  });
  res.redirect('/cart');
}

exports.postCaetDeleteProduct = (req,res) => {
  const productId =req.body.productId;
  findById(productId,product => {
    Cart.deleteProduct(productId,product.price);
    res.redirect('/cart');
  });
}

exports.getOrders = (req,res) => {
  res.render('shop/orders',{
    pageTitle:'Your Orders',
    path:'/orders'
  })
}

exports.getCheckout = (req,res) => {
  res.render('shop/checkout',{
    pageTitle:'Checkout',
    path:'/checkout' 
  })
}