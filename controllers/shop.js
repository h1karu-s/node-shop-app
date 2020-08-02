const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req,res) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/product-list',{
        prods:products,
        pageTitle:'All products',
        path:'/products'
      })
    });
    // res.sendFile(path.join(__dirname,'../views','shop.html'))
  
  }


exports.getProduct = (req,res) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    console.log(product);
    res.render('shop/product-detail',{
      product,
      pageTitle:product.title,
      path:'/products'
    })
  });
};


exports.getIndex = (req,res) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/Index',{
    prods:products,
    pageTitle:'shop',
    path:'/'
  })
});
}


exports.getCart = (req,res) => {
  res.render('shop/cart',{
    pageTitle:'Your Cart',
    path:'/cart'
  })
}

exports.postCart = (req,res) => {
  const productId = req.body.productId;
  Product.findById(productId,(product) => {
    Cart.addProduct(productId,product.price);
  });
  res.redirect('/cart');
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