const express = require('express');
const path = require('path')
const router = express.Router();
const productsContoroller = require('../controllers/product');

const products = [];

router.get('/add-product',productsContoroller.getAddProduct);

router.post('/add-product',productsContoroller.postAddProduct);


module.exports = router;