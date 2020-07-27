const express = require('express');
const { Router } = require('express');
const path = require('path');
const {adminData} = require('./admin'); // products array

const router = express.Router();

router.get('/',(req,res) => {
  console.log(adminData)
  // res.sendFile(path.join(__dirname,'../views','shop.html'))
  
  res.render('shop',{
    prods:adminData,
    pageTitle:'shop',
    path:'/',
    hasProducts:adminData.length > 0,
    activeShop:true,
    productCSS:true
  })
})

module.exports = {
  shopRoutes: router
}