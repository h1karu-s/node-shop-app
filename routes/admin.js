const express = require('express');
const path = require('path')
const router = express.Router();
const adminContoroller = require('../controllers/admin');
const products = [];

router.get('/add-product',adminContoroller.getAddProduct);

router.get('/products',adminContoroller.getProducts);

router.post('/add-product',adminContoroller.postAddProduct);

router.get('/edit-product/:productId',adminContoroller.getEditProduct);

router.post('/edit-product',adminContoroller.postEditProduct);

router.post('/delete-product',adminContoroller.postDeleteProduct);


module.exports = router;