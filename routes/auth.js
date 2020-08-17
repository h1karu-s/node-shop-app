const express = require('express');
const { check,body } = require('express-validator');

const authController = require('../controllers/auth');
const auth = require('../email/auth');
const User = require('../models/user');
const router = express.Router();


router.get('/login',authController.getLogin);

router.get('/signup',authController.getSignup);

router.post('/login',
[
  body('email')
    .isEmail().withMessage('Please enter a valid email.')
    .trim()
    .normalizeEmail(),
  body('password','Please enter a password with only numbers and text and at least 5 characters.')
    .trim()
    .isLength({min:5})
    .isAlphanumeric()
],
authController.postLogin);


router.post('/signup',
[
check('email')
  .isEmail().withMessage('Please enter a valid email.')
  .trim()
  .normalizeEmail()
  .custom((value) => {
    return User.findOne({email:value})
      .then(userDoc => {
        if(userDoc){
          return Promise.reject('Email exits already. please pick a different one.');     
        }
      })
    }),
body('password','Please enter a password with only numbers and text and at least 5 characters.')
  .trim()
  .isLength({min:5})
  .isAlphanumeric(),
body('confirmPassword')
  .trim()
  .isLength({min:1})
  .custom((value,{req}) => {
    if(value !== req.body.password){
      return Promise.reject('Password have to match!');
    }
    return true;
  })
],
authController.postSignup);



router.post('/logout',authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);

module.exports = router;