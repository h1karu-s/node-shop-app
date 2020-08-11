const Product = require('../models/product');



exports.getAddProduct = (req,res) => {
  // res.sendFile(path.join(__dirname,'../views','add-product.html'))
  res.render('admin/edit-product',{
    pageTitle:'Add Product',
    path:'/admin/add-product',
    editing:false
  })}



exports.postAddProduct = (req,res) => {
  const {title,price,description,imageUrl} = req.body;
    const product = new Product(title,price,imageUrl,description,null,req.user._id);
    product.save()
    .then(result => {
      res.redirect('/admin/products') 
      console.log('Created Product')
    })
}



exports.getEditProduct = (req,res) => {
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
  // Product.update(productId,{title:updatedTitle,price:updatedPrice,imageUrl:updatedImageUrl,description:updatedDescription})
  // .then(result => {
  //   res.redirect('/admin/products');
  // })
  // .catch(err => console.log(err));
  const product = new Product(updatedTitle,updatedPrice,updatedImageUrl,updatedDescription,productId);
  product.save()
  .then(result => {
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err));
}



exports.getProducts = (req,res) => {
  Product.fetchAll()
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
  Product.deleteById(productId)
  .then(product => {
     console.log('delete');
     res.redirect('/admin/products');
  })
  .catch(err => console.log(err))  
};
  