const Product = require('../models/product');


exports.getAddProduct = (req,res) => {
  // res.sendFile(path.join(__dirname,'../views','add-product.html'))
  res.render('admin/edit-product',{
    pageTitle:'Add Product',
    path:'/admin/add-product',
    editing:false
  })}


exports.postAddProduct = (req,res) => {
  const {title,imageUrl,price,description} = req.body
    const product = new Product(null,title,imageUrl,description,price);
    product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err))
   
  }


exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit;
    if(!editMode){
      return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId,(product) => {
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
   }


exports.postEditProduct = (req,res) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedProdct = new Product(productId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice);
  updatedProdct.save();
  res.redirect('/admin/products');
}


exports.getProducts = (req,res) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/products',{
    prods:products,
    pageTitle:'Admin/products',
    path:'/admin/products'
    });
  });
};

exports.postDeleteProduct = (req,res) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect('/admin/products');
}