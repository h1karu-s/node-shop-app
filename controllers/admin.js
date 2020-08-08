const Product = require('../models/product');


exports.getAddProduct = (req,res) => {
  // res.sendFile(path.join(__dirname,'../views','add-product.html'))
  res.render('admin/edit-product',{
    pageTitle:'Add Product',
    path:'/admin/add-product',
    editing:false
  })}


exports.postAddProduct = (req,res) => {
  const {title,imageUrl,price,description} = req.body;
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  })
  .then(result => {
    // console.log(result)
    console.log('Created Product!');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err)
  });
   
}


exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit;
    if(!editMode){
      return res.redirect('/');
    }
    const productId = req.params.productId;
    req.user.getProducts({where:{id:productId}})
    // Product.findByPk(productId)
    .then(products => {
      const product = products[0];
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product',{
        pageTitle:'Edit Product',
        path:'/admin/edit-product',
        editing:editMode,
        product
      })
    })
    .catch(err => console.log(err));
   }


exports.postEditProduct = (req,res) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  Product.findByPk(productId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    return product.save()
  })
  .then(result => {
     console.log('Updated Product!') 
     res.redirect('/admin/products')
    })
  .catch(err => console.log(err));
  
}


exports.getProducts = (req,res) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products',{
    prods:products,
    pageTitle:'Admin/products',
    path:'/admin/products'
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req,res) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
  .then(product => {
    return product.destroy();
  })
  .then(result => {
    console.log('Destroyed Product!')
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err))  
};
  