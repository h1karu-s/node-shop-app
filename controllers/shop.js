const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req,res) => {
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
  Product.find()
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
  const productId = req.body.productId;
  req.user.removeFromCart(productId)
  .then(result => {
    console.log('delete!!!');
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
 
}

exports.postOrder = (req,res) => {
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
  .catch(err => console.log(err));
}

exports.getOrders = (req,res) => {
  Order.find({'user.userId':req.user._id})
  .then(orders => {
    res.render('shop/orders',{
      pageTitle:'Your Orders',
      path:'/orders',
      orders:orders
    })
  })
  .catch(err => console.log(err));
}

