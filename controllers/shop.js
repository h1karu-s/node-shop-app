const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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

exports.getInvoice = (req,res,next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order => {
    if(!order){
      console.log('no order');
      return next(new Error('No Order found.'));
    }
    if(order.user.userId.toString() !== req.user._id.toString()){
      console.log('unauthorized invoice');
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data','invoices',invoiceName);
    console.log(invoicePath);

    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`inline; filename=${invoiceName}`);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice',{
      underline:true
    });
    pdfDoc.text('-------------------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x JPY,${prod.product.price}`)
    });
    pdfDoc.text('------------');
    pdfDoc.fontSize(20).text(`Total Price:  JPY,${totalPrice}`);

    pdfDoc.end();

    // fs.readFile(invoicePath,(err,data) => {
    //   if(err){
    //     console.log(err);
    //     next(err);
    //   }
    //   res.setHeader('Content-Type','application/pdf');
    //   res.setHeader('Content-Disposition',`inline; filename=${invoiceName}`);
    //   res.send(data);
    // });
    // const file = fs.createReadStream(invoicePath);
   
    // file.pipe(res);
  })
  .catch(err => {
    next(err);
  });
  
};
