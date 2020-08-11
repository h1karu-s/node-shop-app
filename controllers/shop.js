const Product = require('../models/product');


exports.getProducts = (req,res) => {
  Product.fetchAll()
  .then(products => {
    // console.log(products)
    res.render('shop/product-list',{
      prods:products,
      pageTitle:'All Products',
      path:'/products'
  })
  })
  .catch(err => {
    console.log(err)
  })
 };


exports.getProduct = (req,res) => {
  const productId = req.params.productId;

  Product.findById(productId)
  .then((product) => {
    // console.log(product)
    res.render('shop/product-detail',{
      product:product,
      pageTitle:product.title,
      path:'/products'
    })
  })
  .catch(err => console.log(err))
};


exports.getIndex = (req,res) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/Index',{
      prods:products,
      pageTitle:'shop',
      path:'/'
  })
  })
  .catch(err => {
    console.log(err)
  })

}


exports.getCart =  (req,res) => {

req.user.getCart()
.then(products => {
  console.log(products)
  res.render('shop/cart',{
    pageTitle:'Your Cart',
    path:'/cart',
    products:products
  })
})
.catch(err => console.log(err));
            
}

exports.postCart = (req,res) => {
  const productId = req.body.productId; 
  Product.findById(productId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(user => {
    console.log('add to cart!!!');
    res.redirect('/cart');
  })
  .catch(err => console.log(err));

}

exports.postCartDeleteProduct = (req,res) => {
  const productId =req.body.productId;
  req.user.deleteCartItem(productId)
  .then(result => {
    console.log('delete!!!');
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
 
}

exports.postOrder = (req,res) => {
  req.user.addOrder()
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
  
}

exports.getOrders = (req,res) => {
  req.user.getOrders()
  .then(orders => {
    console.log(orders)
    res.render('shop/orders',{
      pageTitle:'Your Orders',
      path:'/orders',
      orders:orders
    })
  })
  .catch(err => console.log(err)); 
}

