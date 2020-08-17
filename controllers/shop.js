const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req,res,next) => {
  Product.find()
  .then(products => {
    console.log(products)
    res.render('shop/product-list',{
      prods:products,
      pageTitle:'All Products',
      path:'/products'
  })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
 };


exports.getProduct = (req,res,next) => {
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};


exports.getIndex = (req,res,next) => {
  Product.find()
  .then(products => {
    res.render('shop/Index',{
      prods:products,
      pageTitle:'shop',
      path:'/'
  })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })

}


exports.getCart =  (req,res,next) => {
req.user
.populate('cart.items.productId')
.execPopulate()
.then(user => {
  const products = user.cart.items;
  console.log(products)
  res.render('shop/cart',{
    pageTitle:'Your Cart',
    path:'/cart',
    products:products
  })
})
.catch(err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
});
            
}

exports.postCart = (req,res,next) => {
  const productId = req.body.productId; 
  Product.findById(productId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(user => {
    console.log('add to cart!!!');
    res.redirect('/cart');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

}

exports.postCartDeleteProduct = (req,res,next) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId)
  .then(result => {
    console.log('delete!!!');
    res.redirect('/cart');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
 
}

exports.postOrder = (req,res,next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
  const products = user.cart.items.map(item => {
    return {product:{...item.productId},quantity:item.quantity};
  });
  const order = new Order({
    user:{
      email:req.user.email,
      userId:req.user
    },
    products
  })
  return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.getOrders = (req,res,next) => {
  Order.find({'user.userId':req.user._id})
  .then(orders => {
    res.render('shop/orders',{
      pageTitle:'Your Orders',
      path:'/orders',
      orders:orders
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

