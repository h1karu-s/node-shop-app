const express = require('express');
const {body} = require('express-validator');

const adminContoroller = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const router = express.Router();



router.get('/add-product',isAuth,adminContoroller.getAddProduct);



router.get('/products',isAuth,adminContoroller.getProducts);



router.post('/add-product',
[
  body('title')
  .isString()
  .isLength({min:1}),
  body('price')
  .isInt(),
  body('description')
  .isLength({min:5,max:400})
]
,isAuth,adminContoroller.postAddProduct);



router.get('/edit-product/:productId',isAuth,adminContoroller.getEditProduct);



router.post('/edit-product',[
  body('title')
    .isString()
    .isLength({min:1}),
  body('price')
    .isInt(),
  body('description')
    .isLength({min:5,max:400})
],isAuth,adminContoroller.postEditProduct);



router.post('/delete-product',isAuth,adminContoroller.postDeleteProduct);


module.exports = router;



