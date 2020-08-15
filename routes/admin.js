const express = require('express');
const adminContoroller = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



router.get('/add-product',isAuth,adminContoroller.getAddProduct);

router.get('/products',isAuth,adminContoroller.getProducts);

router.post('/add-product',isAuth,adminContoroller.postAddProduct);

router.get('/edit-product/:productId',isAuth,adminContoroller.getEditProduct);

router.post('/edit-product',isAuth,adminContoroller.postEditProduct);

router.post('/delete-product',isAuth,adminContoroller.postDeleteProduct);


module.exports = router;